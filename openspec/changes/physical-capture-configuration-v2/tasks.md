# Tasks

## 1. Scope and Routing
- [ ] 1.1 Confirmar `/campaigns/[campaignId]/settings` como ubicación canónica de `Configuración de toma física`.
- [ ] 1.2 Reducir `/campaigns/new` a creación ligera de campaña y defaults iniciales.
- [ ] 1.3 Redirigir campañas nuevas en estado `DRAFT` hacia `/campaigns/[campaignId]/settings`.
- [ ] 1.4 Agregar breadcrumb `Campañas > {campaign.name} > Configuración de toma física`.
- [ ] 1.5 Asegurar que la pantalla no sea accesible fuera del tenant/campaign scope.

## 2. Prisma Schema and Migration
- [ ] 2.1 Extender `Campaign.inventoryMode` para usar `SIMPLE_COUNT`, `FULL_AUDIT`, `CUSTOM`.
- [ ] 2.2 Crear migración/backfill desde `FULL_COUNT`, `SELECTIVE`, `CYCLE_COUNT`.
- [ ] 2.3 Extender `CampaignSettings` con:
  - `assetManagementMethod`
  - `allowOfflineCapture`
  - `allowEditRecords`
  - `requireSupervisorReview`
  - `autoCloseCampaign`
  - `allowSurplusAssets`
  - `manualAssetLimit`
  - reglas de evidencia
  - condición/estado físico configurable
- [ ] 2.4 Extender `CampaignInventoryField` con:
  - `requirement`
  - `helpText`
  - `optionsJson`
  - `defaultValue`
  - flags de visibilidad
  - `visibilityConditionJson`
  - `isSystem`
  - `scope`
- [ ] 2.5 Backfill `requirement` desde `isRequired` y `isVisible`.
- [ ] 2.6 Extender o confirmar `ImportJob` para validación de maestro.
- [ ] 2.7 Ejecutar `prisma format`, `prisma validate` y `prisma generate`.
- [ ] 2.8 Crear migración SQL Server compatible y probar contra Azure SQL/local.

## 3. Domain Model
- [ ] 3.1 Crear `src/features/campaign-settings/domain/capture-settings.ts`.
- [ ] 3.2 Modelar tipos:
  - `InventoryMode`
  - `AssetManagementMethod`
  - `CaptureFieldRequirement`
  - `EvidenceRequirement`
  - `CaptureFieldScope`
  - `CaptureFieldDataType`
- [ ] 3.3 Crear presets por modo en `inventory-mode-presets.ts`.
- [ ] 3.4 Mapear compatibilidad con campos antiguos.
- [ ] 3.5 Definir validaciones de configuración por modo.
- [ ] 3.6 Definir reglas para activación de campaña según configuración.

## 4. Repository and Application Layer
- [ ] 4.1 Crear `campaign-settings-repository.ts` tenant-aware.
- [ ] 4.2 Implementar `getCaptureSettings(campaignId)`.
- [ ] 4.3 Implementar `updateCaptureSettings(campaignId, input)`.
- [ ] 4.4 Implementar `resetCaptureSettings(campaignId, mode)`.
- [ ] 4.5 Implementar `applyInventoryModePreset(draft, mode)`.
- [ ] 4.6 Implementar validación para bloqueo de cambios destructivos si campaña está `CLOSED`.
- [ ] 4.7 Revalidar rutas `settings`, `assets`, `capture`, `dashboard` al guardar.

## 5. Settings Page Shell
- [ ] 5.1 Rehacer `/campaigns/[campaignId]/settings/page.tsx` como página server.
- [ ] 5.2 Cargar campaña y configuración desde application layer.
- [ ] 5.3 Renderizar shell con título, descripción, breadcrumbs, reset y guardar.
- [ ] 5.4 Crear componente cliente `PhysicalCaptureSettingsForm`.
- [ ] 5.5 Mantener estado local con dirty state.
- [ ] 5.6 Confirmar antes de cambiar modo si hay cambios sin guardar.

## 6. Inventory Mode Selector
- [ ] 6.1 Crear selector lateral desktop para:
  - Conteo simple
  - Auditoría completa
  - Personalizado
- [ ] 6.2 Crear selector mobile como cards/accordion o sheet.
- [ ] 6.3 Mostrar icono, descripción y estado seleccionado.
- [ ] 6.4 Aplicar preset local al seleccionar modo.
- [ ] 6.5 Marcar diferencias entre preset y configuración editada.

## 7. Conteo Simple UI
- [ ] 7.1 Implementar panel de resumen del modo.
- [ ] 7.2 Implementar método de gestión de activos:
  - Carga masiva
  - Registro manual
  - Ambos
- [ ] 7.3 Mostrar límite de activos manuales cuando aplique.
- [ ] 7.4 Implementar campos a capturar simplificados.
- [ ] 7.5 Implementar condición y estado con distribución ejemplo.
- [ ] 7.6 Implementar CTA contextual `Ir a Activos`.

## 8. Auditoría Completa UI
- [ ] 8.1 Implementar panel de resumen del modo.
- [ ] 8.2 Mostrar `Cargar maestro` como acción principal.
- [ ] 8.3 Enforzar carga masiva obligatoria visualmente.
- [ ] 8.4 Implementar campos obligatorios y opcionales.
- [ ] 8.5 Implementar reglas de evidencia:
  - foto del activo
  - fotos adicionales
  - otros archivos
  - observaciones con foto
- [ ] 8.6 Implementar activos sobrantes y campos requeridos.
- [ ] 8.7 Implementar condición y estado físico.

## 9. Personalizado UI
- [ ] 9.1 Implementar matriz editable de campos.
- [ ] 9.2 Soportar obligatorio/opcional/no aplica por campo.
- [ ] 9.3 Implementar configuración de evidencia editable.
- [ ] 9.4 Implementar activos sobrantes editable.
- [ ] 9.5 Implementar condición y estado editable.
- [ ] 9.6 Implementar sección `Campos personalizados`.
- [ ] 9.7 Implementar resumen/vista previa de captura móvil.

## 10. Master Upload Modal
- [ ] 10.1 Crear `MasterUploadModal`.
- [ ] 10.2 Soportar drag/drop y botón seleccionar archivo.
- [ ] 10.3 Validar extensiones `.xlsx`, `.xls`, `.csv`.
- [ ] 10.4 Mostrar campos mínimos requeridos.
- [ ] 10.5 Implementar descarga de plantilla.
- [ ] 10.6 Implementar `validateMasterImport`.
- [ ] 10.7 Mostrar total de registros, válidos, advertencias y errores.
- [ ] 10.8 Deshabilitar confirmar hasta validación exitosa.
- [ ] 10.9 Implementar versión mobile full-screen sheet.

## 11. Custom Field Modal
- [ ] 11.1 Crear `CustomFieldModal`.
- [ ] 11.2 Capturar nombre, descripción, tipo, obligatoriedad y default.
- [ ] 11.3 Soportar tipos texto, número, fecha, lista, sí/no y archivo.
- [ ] 11.4 Soportar visibilidad en captura móvil, detalle y reportes.
- [ ] 11.5 Soportar condición de visibilidad básica.
- [ ] 11.6 Validar duplicidad de key por campaña.
- [ ] 11.7 Permitir editar y eliminar solo campos no sistema.
- [ ] 11.8 Implementar versión mobile full-screen sheet.

## 12. Mobile UX
- [ ] 12.1 Reemplazar tablas por cards en pantallas menores a `md`.
- [ ] 12.2 Usar controles grandes y touch-friendly.
- [ ] 12.3 Mantener guardar como sticky footer.
- [ ] 12.4 Evitar overflow horizontal.
- [ ] 12.5 Asegurar que modales funcionen como sheets en mobile.
- [ ] 12.6 Probar iPhone-width y Android-width.

## 13. Save, Reset and Confirmation
- [ ] 13.1 Implementar `Guardar configuración`.
- [ ] 13.2 Implementar `Restablecer valores por defecto`.
- [ ] 13.3 Pedir confirmación cuando reset sobrescriba campos custom.
- [ ] 13.4 Mostrar toast/mensaje de éxito.
- [ ] 13.5 Mostrar errores de validación inline.
- [ ] 13.6 Bloquear guardado si configuración del modo es inválida.

## 14. Campaign Creation Review
- [ ] 14.1 Mantener `/campaigns/new` ligero.
- [ ] 14.2 Si se conserva wizard, mover configuración completa fuera del wizard.
- [ ] 14.3 Implementar modal de revisión y confirmación solo para datos de campaña.
- [ ] 14.4 Al confirmar, crear campaña y settings defaults.
- [ ] 14.5 Ofrecer CTA posterior: `Configurar toma física`.

## 15. Consumption by Other Modules
- [ ] 15.1 Actualizar `Campaña > Activos` para mostrar método de gestión.
- [ ] 15.2 Bloquear carga manual si `BULK_ONLY`.
- [ ] 15.3 Aplicar límite manual si `manualAssetLimit` está definido.
- [ ] 15.4 Actualizar captura móvil para leer `CampaignInventoryField`.
- [ ] 15.5 Aplicar obligatoriedad y visibilidad en captura móvil.
- [ ] 15.6 Aplicar reglas de evidencia antes de submit.
- [ ] 15.7 Permitir sobrantes solo si `allowSurplusAssets`.
- [ ] 15.8 Preparar conciliación para usar campos configurados.

## 16. Tests and Validation
- [ ] 16.1 Añadir pruebas unitarias de presets.
- [ ] 16.2 Añadir pruebas unitarias de validaciones de configuración.
- [ ] 16.3 Añadir pruebas de repository tenant-aware.
- [ ] 16.4 Añadir prueba de server action de guardado.
- [ ] 16.5 Añadir prueba manual documentada mobile.
- [ ] 16.6 Ejecutar `npm run lint`.
- [ ] 16.7 Ejecutar `npm run build`.
- [ ] 16.8 Ejecutar `prisma validate`.

## 17. Rollout
- [ ] 17.1 Migrar campañas existentes con presets.
- [ ] 17.2 Verificar datos en Azure SQL.
- [ ] 17.3 Desplegar primero a ambiente de prueba.
- [ ] 17.4 Crear campaña nueva y validar configuración completa.
- [ ] 17.5 Validar captura móvil con cada modo.
- [ ] 17.6 Documentar limitaciones pendientes de importación real si el parser queda como stub.
