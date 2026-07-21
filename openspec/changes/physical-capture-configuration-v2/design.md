# Design: Physical Capture Configuration v2

## Decision
Implementar las pantallas de configuración de toma física en `Campaña > Configuración`, usando `/campaigns/[campaignId]/settings` como ruta principal.

`/campaigns/new` debe quedar como flujo ligero de creación. Puede incluir una selección inicial opcional del tipo de inventario, pero la configuración completa pertenece a la campaña creada.

## User Flow

### 1. Create Campaign
Route:

```text
/campaigns/new
```

Purpose:
- Nombre
- Cliente
- Descripción
- Fecha inicio
- Fecha fin
- Sede principal
- Tipo inicial opcional

Result:
- Campaign en `DRAFT`
- CampaignSettings creado con defaults
- CampaignInventoryField creado con preset inicial
- Redirect recomendado a `/campaigns/[campaignId]/settings`

### 2. Configure Physical Capture
Route:

```text
/campaigns/[campaignId]/settings
```

Purpose:
- Seleccionar tipo de inventario.
- Configurar método de gestión de activos.
- Configurar campos de captura.
- Configurar evidencia.
- Configurar activos sobrantes.
- Configurar condición/estado físico.
- Agregar campos personalizados.
- Guardar contrato de captura.

### 3. Upload Asset Master
Modal triggered from:

```text
/campaigns/[campaignId]/settings
/campaigns/[campaignId]/assets
```

Purpose:
- Cargar Excel/CSV.
- Validar columnas mínimas.
- Contar registros válidos, advertencias y errores.
- Confirmar carga para crear `ImportJob` y `AssetMasterRow`.

### 4. Capture Mobile Reads Settings
Routes:

```text
/campaigns/[campaignId]/assets/[assetId]/capture
/campaigns/[campaignId]/capture
```

Purpose:
- Renderizar campos según `CampaignInventoryField`.
- Aplicar evidencia obligatoria.
- Permitir o bloquear sobrantes.
- Aplicar cantidad/estado físico según modo.

## Inventory Modes

### Conteo simple
Use when:
- Inventario rápido.
- Se requiere registrar código/tipo y cantidad.
- Evidencia mínima.

Defaults:
- `inventoryMode`: `SIMPLE_COUNT`
- `assetManagementMethod`: `BULK_ONLY` por defecto, configurable a `MANUAL_ONLY` o `HYBRID`.
- Campos obligatorios:
  - código o tipo de activo
  - cantidad encontrada
  - ubicación observada
- Campos opcionales:
  - observaciones
- Evidencia:
  - foto opcional
- Condición:
  - distribución por Bueno / Regular / Dañado opcional

### Auditoría completa
Use when:
- Auditoría externa o interna formal.
- Activos críticos.
- Evidencia obligatoria.
- Maestro de activos como base de comparación.

Defaults:
- `inventoryMode`: `FULL_AUDIT`
- `assetManagementMethod`: `BULK_ONLY`
- Carga de maestro requerida.
- Campos obligatorios:
  - código del activo / QR / código de barras
  - estado de toma
  - ubicación observada
  - estado físico
  - responsable observado
  - foto del activo
  - observaciones
- Campos opcionales:
  - cantidad encontrada
  - número de serie
  - centro de costo
  - activo crítico
- Evidencia:
  - foto principal obligatoria
  - fotos adicionales mínimas configurables
  - archivos opcionales
  - observación con foto obligatoria si existe diferencia
- Sobrantes:
  - permitido por configuración
  - requiere información mínima

### Personalizado
Use when:
- La campaña tiene reglas propias.
- El cliente define campos especiales.
- Se requieren reglas condicionales.

Defaults:
- `inventoryMode`: `CUSTOM`
- `assetManagementMethod`: `HYBRID`
- Campos editables por usuario:
  - obligatorio
  - opcional
  - no aplica
- Evidencia configurable.
- Campos personalizados con tipo:
  - texto
  - número
  - fecha
  - lista desplegable
  - sí/no
  - archivo
- Visibilidad:
  - captura móvil del auditor
  - detalle del activo
  - reportes
- Condición de visibilidad opcional.

## UX Architecture

### Desktop
Layout:

```text
Header
  Breadcrumbs
  Title
  Reset defaults
  Save configuration

Grid
  Left rail: inventory mode selector
  Main panel: mode-specific configuration
```

Rules:
- Do not show every mode at once.
- Active mode owns the main panel.
- Save is sticky at top-right or footer when content is long.
- Reset defaults applies only to selected mode and asks confirmation when dirty.

### Mobile
Layout:

```text
Top summary
Mode selector as segmented list / drawer
Accordion sections:
  Método de gestión
  Campos a capturar
  Evidencia
  Activos sobrantes
  Condición y estado
  Campos personalizados
Sticky bottom Save
```

Rules:
- No wide tables on mobile.
- Field matrix becomes cards with segmented controls.
- Upload master modal becomes full-screen sheet on mobile.
- Custom field modal becomes full-screen sheet on mobile.

## Prisma Design

### Current models to extend
Reuse:
- `Campaign`
- `CampaignSettings`
- `CampaignInventoryField`
- `AssetMasterRow`
- `ImportJob`
- `AssetCapture`
- `EvidenceFile`

### Required changes

#### Campaign
Change comments/defaults and values:

```text
inventoryMode:
  SIMPLE_COUNT
  FULL_AUDIT
  CUSTOM
```

Keep as `String` initially to avoid enum migration friction with SQL Server, or introduce Prisma enum in a dedicated migration if all current data can be backfilled safely.

#### CampaignSettings
Add:

```text
assetManagementMethod String @default("BULK_ONLY") @map("asset_management_method")
allowOfflineCapture Boolean @default(true) @map("allow_offline_capture")
allowEditRecords Boolean @default(true) @map("allow_edit_records")
requireSupervisorReview Boolean @default(true) @map("require_supervisor_review")
autoCloseCampaign Boolean @default(false) @map("auto_close_campaign")
allowSurplusAssets Boolean @default(false) @map("allow_surplus_assets")
manualAssetLimit Int? @map("manual_asset_limit")
primaryPhotoRequirement String @default("OPTIONAL") @map("primary_photo_requirement")
additionalPhotosRequirement String @default("OPTIONAL") @map("additional_photos_requirement")
additionalPhotosMin Int @default(0) @map("additional_photos_min")
otherFilesRequirement String @default("OPTIONAL") @map("other_files_requirement")
photoObservationRule String @default("OPTIONAL") @map("photo_observation_rule")
conditionOptionsJson String? @map("condition_options_json")
conditionRequiresObservationRule String? @map("condition_requires_observation_rule")
```

Allowed values:

```text
assetManagementMethod:
  BULK_ONLY
  MANUAL_ONLY
  HYBRID

photo/evidence requirement:
  REQUIRED
  OPTIONAL
  NOT_APPLICABLE
  REQUIRED_WHEN_DIFFERENCE
```

#### CampaignInventoryField
Extend:

```text
requirement String @default("OPTIONAL")
helpText String?
optionsJson String?
defaultValue String?
showInMobileCapture Boolean @default(true) @map("show_in_mobile_capture")
showInAssetDetail Boolean @default(true) @map("show_in_asset_detail")
showInReports Boolean @default(true) @map("show_in_reports")
visibilityConditionJson String? @map("visibility_condition_json")
isSystem Boolean @default(false) @map("is_system")
```

Allowed values:

```text
requirement:
  REQUIRED
  OPTIONAL
  NOT_APPLICABLE

dataType:
  TEXT
  NUMBER
  DATE
  BOOLEAN
  SELECT
  FILE
```

Migration note:
- Keep `isRequired` and `isVisible` during transition.
- Backfill `requirement` from `isRequired` and `isVisible`.
- Later deprecate reads from `isRequired` after all code uses `requirement`.

#### New model: CampaignSurplusField
Needed if surplus assets require independent field list.

```prisma
model CampaignSurplusField {
  id          String   @id @default(uuid())
  tenantId    String   @map("tenant_id")
  campaignId  String   @map("campaign_id")
  key         String
  label       String
  dataType    String   @map("data_type")
  requirement String   @default("REQUIRED")
  position    Int      @default(0)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  campaign    Campaign @relation(fields: [campaignId], references: [id])

  @@unique([campaignId, key])
  @@index([tenantId, campaignId])
  @@map("campaign_surplus_fields")
}
```

Alternative:
- Use `CampaignInventoryField` with `scope = CAPTURE | SURPLUS | BOTH`.
- Recommended: add `scope` to `CampaignInventoryField` instead of creating another model, unless surplus diverges strongly.

Recommended schema addition:

```text
scope String @default("CAPTURE")
```

Allowed values:

```text
CAPTURE
SURPLUS
BOTH
```

#### ImportJob
Current model should be reused. Extend if missing after full schema review:

```text
validatedAt
confirmedAt
totalRows
validRows
warningRows
errorRows
validationSummaryJson
originalFileName
fileSizeBytes
```

## Application Services

Create feature boundary:

```text
src/features/campaign-settings/
  domain/
    capture-settings.ts
    inventory-mode-presets.ts
  application/
    get-capture-settings.ts
    update-capture-settings.ts
    reset-capture-settings.ts
    validate-master-import.ts
    confirm-master-import.ts
  infrastructure/
    campaign-settings-repository.ts
  ui/
    physical-capture-settings-page.tsx
    inventory-mode-selector.tsx
    master-upload-modal.tsx
    custom-field-modal.tsx
```

Reason:
- `campaigns` owns campaign lifecycle.
- `campaign-settings` owns the detailed capture contract.
- `captures`, `assets`, `evidence` consume settings but do not own them.

## Preset Strategy

Define mode presets in code:

```text
getPresetForMode(mode)
```

Preset includes:
- assetManagementMethod
- settings flags
- evidence rules
- capture fields
- surplus fields
- condition options

Rules:
- Selecting a mode applies preset to local draft.
- User must explicitly save.
- Reset defaults reapplies preset for active mode.
- Switching mode with unsaved changes prompts confirmation.

## Master Upload Modal

States:
- `idle`
- `selected`
- `validating`
- `validated`
- `confirmed`
- `failed`

Required columns:
- Código del activo
- Descripción
- Categoría
- Ubicación esperada
- Responsable esperado
- Número de serie
- Centro de costo
- Activo crítico

Validation output:
- total records
- valid records
- warnings
- errors

Mobile behavior:
- Full-screen sheet.
- File input must be large touch target.
- Confirm button disabled until validation passes.

## Custom Field Modal

Fields:
- name
- description/help text
- data type
- requirement
- default value
- show in mobile capture
- show in asset detail
- show in reports
- visibility condition

Rules:
- Field key generated from name.
- Duplicate key blocked per campaign.
- System fields cannot be deleted.
- Custom fields can be edited/deleted until campaign is closed.

## Validation Rules

General:
- Cannot activate campaign without valid capture settings.
- `FULL_AUDIT` requires `BULK_ONLY` or `HYBRID` with at least one confirmed master upload.
- `MANUAL_ONLY` can enforce manual asset limit.
- `captureRequiresPhoto` should be derived from evidence settings for backward compatibility.
- `captureRequiresGeo` should be derived from GPS field requirement.

Mobile capture:
- Hide `NOT_APPLICABLE` fields.
- Block submit when required fields are missing.
- Apply file/photo requirements before submit.
- Allow surplus asset capture only when `allowSurplusAssets = true`.

## Backward Compatibility

Current app fields:
- `Campaign.inventoryMode`
- `CampaignSettings.captureRequiresPhoto`
- `CampaignSettings.captureRequiresGeo`
- `CampaignSettings.allowManualAssets`
- `CampaignSettings.closeBlocksCaptures`

Compatibility mapping:
- `captureRequiresPhoto = primaryPhotoRequirement == REQUIRED`
- `captureRequiresGeo = gps field requirement == REQUIRED`
- `allowManualAssets = assetManagementMethod in (MANUAL_ONLY, HYBRID)`
- `closeBlocksCaptures` remains as-is

Existing campaigns:
- Map old `FULL_COUNT` to `FULL_AUDIT`.
- Map old `SELECTIVE` to `CUSTOM`.
- Map old `CYCLE_COUNT` to `SIMPLE_COUNT`.
- Create default fields from preset when campaign has no fields.

## Acceptance Criteria
- The configuration screen matches the PDD structure for all three modes.
- Desktop has left mode rail and mode-specific main panel.
- Mobile avoids wide tables and uses cards/accordions.
- Settings persist to Prisma and reload correctly.
- Reset defaults restores current mode preset.
- Upload master modal validates and surfaces summary.
- Custom field modal creates fields consumed by settings page.
- Existing campaigns do not break after migration.
