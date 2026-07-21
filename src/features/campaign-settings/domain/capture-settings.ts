export const inventoryModes = [
  "simple_count",
  "full_audit",
  "custom",
] as const;

export const assetManagementMethods = [
  "bulk_only",
  "manual_only",
  "hybrid",
] as const;

export const fieldRequirements = [
  "required",
  "optional",
  "not_applicable",
] as const;

export const evidenceRequirements = [
  "required",
  "optional",
  "not_applicable",
  "required_when_difference",
] as const;

export const fieldDataTypes = [
  "text",
  "number",
  "date",
  "boolean",
  "select",
  "file",
] as const;

export const fieldScopes = ["capture", "surplus", "both"] as const;

export type InventoryMode = (typeof inventoryModes)[number];
export type AssetManagementMethod = (typeof assetManagementMethods)[number];
export type FieldRequirement = (typeof fieldRequirements)[number];
export type EvidenceRequirement = (typeof evidenceRequirements)[number];
export type FieldDataType = (typeof fieldDataTypes)[number];
export type FieldScope = (typeof fieldScopes)[number];

export type ConditionOption = {
  key: string;
  label: string;
  description: string;
  color: string;
  exampleQuantity: number;
};

export type CaptureField = {
  id?: string;
  key: string;
  label: string;
  dataType: FieldDataType;
  requirement: FieldRequirement;
  helpText: string;
  options: string[];
  defaultValue: string;
  showInMobileCapture: boolean;
  showInAssetDetail: boolean;
  showInReports: boolean;
  visibilityCondition: string;
  isSystem: boolean;
  scope: FieldScope;
  position: number;
};

export type CaptureSettingsInput = {
  inventoryMode: InventoryMode;
  assetManagementMethod: AssetManagementMethod;
  allowOfflineCapture: boolean;
  allowEditRecords: boolean;
  requireSupervisorReview: boolean;
  autoCloseCampaign: boolean;
  allowSurplusAssets: boolean;
  manualAssetLimit: number | null;
  primaryPhotoRequirement: EvidenceRequirement;
  additionalPhotosRequirement: EvidenceRequirement;
  additionalPhotosMin: number;
  otherFilesRequirement: EvidenceRequirement;
  photoObservationRule: EvidenceRequirement;
  conditionOptions: ConditionOption[];
  conditionRequiresObservationRule: string;
  notes: string;
  fields: CaptureField[];
};

export type CaptureSettings = CaptureSettingsInput & {
  campaignId: string;
  updatedAt: Date;
};

export const defaultConditionOptions: ConditionOption[] = [
  {
    key: "good",
    label: "Bueno",
    description: "Activo en buen estado, sin daños visibles.",
    color: "#0f988c",
    exampleQuantity: 100,
  },
  {
    key: "regular",
    label: "Regular",
    description: "Activo con desgaste normal o detalles menores.",
    color: "#f7bd17",
    exampleQuantity: 20,
  },
  {
    key: "damaged",
    label: "Dañado",
    description: "Activo con daños que afectan su estado.",
    color: "#ff4d4f",
    exampleQuantity: 5,
  },
];

const baseOptions = {
  showInMobileCapture: true,
  showInAssetDetail: true,
  showInReports: true,
  visibilityCondition: "",
  defaultValue: "",
  options: [],
  scope: "capture" as const,
  isSystem: true,
};

function field(
  key: string,
  label: string,
  dataType: FieldDataType,
  requirement: FieldRequirement,
  helpText: string,
  position: number,
  overrides: Partial<CaptureField> = {},
): CaptureField {
  return {
    ...baseOptions,
    key,
    label,
    dataType,
    requirement,
    helpText,
    position,
    ...overrides,
  };
}

export function getPresetForMode(mode: InventoryMode): CaptureSettingsInput {
  if (mode === "full_audit") {
    return {
      inventoryMode: "full_audit",
      assetManagementMethod: "bulk_only",
      allowOfflineCapture: true,
      allowEditRecords: true,
      requireSupervisorReview: true,
      autoCloseCampaign: false,
      allowSurplusAssets: true,
      manualAssetLimit: null,
      primaryPhotoRequirement: "required",
      additionalPhotosRequirement: "required",
      additionalPhotosMin: 2,
      otherFilesRequirement: "optional",
      photoObservationRule: "required_when_difference",
      conditionOptions: defaultConditionOptions,
      conditionRequiresObservationRule: "difference_or_bad_condition",
      notes: "",
      fields: [
        field(
          "asset_code",
          "Código del activo / QR / código de barras",
          "text",
          "required",
          "Identificador que se escanea o ingresa en terreno.",
          0,
        ),
        field("capture_status", "Estado de toma", "select", "required", "Encontrado, no encontrado o sobrante.", 1, {
          options: ["Encontrado", "No encontrado", "Sobrante"],
        }),
        field("observed_location", "Ubicación observada", "text", "required", "Lugar real donde está el activo.", 2),
        field("physical_condition", "Estado físico", "select", "required", "Bueno, regular, malo o dañado.", 3, {
          options: ["Bueno", "Regular", "Malo", "Dañado", "No aplica"],
        }),
        field("observed_responsible", "Responsable observado", "text", "required", "Persona que utiliza o custodia el activo.", 4),
        field("asset_photo", "Foto del activo", "file", "required", "Evidencia visual principal.", 5),
        field("notes", "Observaciones", "text", "required", "Comentario del auditor.", 6),
        field("quantity_found", "Cantidad encontrada (si aplica)", "number", "optional", "Unidades contadas para el código.", 7),
        field("serial_number", "Número de serie", "text", "optional", "Serie visible en el activo.", 8),
        field("cost_center", "Centro de costo", "text", "optional", "Centro observado o validado.", 9),
        field("critical_asset", "Activo crítico", "boolean", "optional", "Marcador de criticidad.", 10),
      ],
    };
  }

  if (mode === "custom") {
    return {
      inventoryMode: "custom",
      assetManagementMethod: "hybrid",
      allowOfflineCapture: true,
      allowEditRecords: true,
      requireSupervisorReview: true,
      autoCloseCampaign: false,
      allowSurplusAssets: true,
      manualAssetLimit: 20,
      primaryPhotoRequirement: "required",
      additionalPhotosRequirement: "optional",
      additionalPhotosMin: 0,
      otherFilesRequirement: "optional",
      photoObservationRule: "required_when_difference",
      conditionOptions: defaultConditionOptions,
      conditionRequiresObservationRule: "difference_or_bad_condition",
      notes: "",
      fields: [
        field("asset_code", "Código del activo / QR / código de barras", "text", "required", "Código a escanear.", 0),
        field("capture_status", "Estado de toma", "select", "required", "Resultado del conteo.", 1, {
          options: ["Encontrado", "No encontrado", "Sobrante"],
        }),
        field("observed_location", "Ubicación observada", "text", "required", "Lugar real.", 2),
        field("physical_condition", "Estado físico", "select", "optional", "Condición física.", 3, {
          options: ["Bueno", "Regular", "Malo", "Dañado", "No aplica"],
        }),
        field("observed_responsible", "Responsable observado", "text", "optional", "Responsable real.", 4),
        field("asset_photo", "Foto del activo", "file", "optional", "Foto de respaldo.", 5),
        field("notes", "Observaciones", "text", "optional", "Comentario del auditor.", 6),
        field("quantity_found", "Cantidad encontrada (si aplica)", "number", "optional", "Cantidad contada.", 7),
        field("serial_number", "Número de serie", "text", "not_applicable", "Serie visible.", 8),
        field("cost_center", "Centro de costo", "text", "not_applicable", "Centro observado.", 9),
        field("critical_asset", "Activo crítico", "boolean", "optional", "Activo de alto impacto.", 10),
      ],
    };
  }

  return {
    inventoryMode: "simple_count",
    assetManagementMethod: "bulk_only",
    allowOfflineCapture: true,
    allowEditRecords: true,
    requireSupervisorReview: false,
    autoCloseCampaign: false,
    allowSurplusAssets: false,
    manualAssetLimit: 20,
    primaryPhotoRequirement: "optional",
    additionalPhotosRequirement: "not_applicable",
    additionalPhotosMin: 0,
    otherFilesRequirement: "not_applicable",
    photoObservationRule: "optional",
    conditionOptions: defaultConditionOptions,
    conditionRequiresObservationRule: "difference_or_bad_condition",
    notes: "",
    fields: [
      field("asset_code", "Código o tipo de activo", "text", "required", "Código escaneado o tipo contado.", 0),
      field("quantity_found", "Cantidad encontrada", "number", "required", "Cantidad encontrada en terreno.", 1),
      field("observed_location", "Ubicación observada", "text", "required", "Lugar real donde se contó.", 2),
      field("notes", "Observaciones", "text", "optional", "Comentario opcional del auditor.", 3),
    ],
  };
}

const inventoryModeLabels: Record<InventoryMode, string> = {
  simple_count: "Conteo simple",
  full_audit: "Auditoría completa",
  custom: "Personalizado",
};

export function getInventoryModeLabel(mode: InventoryMode) {
  return inventoryModeLabels[mode];
}

export function isInventoryMode(value: string): value is InventoryMode {
  return inventoryModes.includes(value as InventoryMode);
}

