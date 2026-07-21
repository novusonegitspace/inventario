# Tasks

## 1. Program Foundation
- [ ] 1.1 Declarar el PDD-Dev v2.0 como fuente de verdad funcional y UX para el repo.
- [ ] 1.2 Inventariar divergencias entre el código actual y el PDD.
- [ ] 1.3 Congelar la creación de nuevas pantallas fuera de esta alineación.
- [ ] 1.4 Eliminar o deprecar rutas principales que violen la arquitectura del PDD.

## 2. Information Architecture and Navigation
- [ ] 2.1 Ajustar el menú principal a `Dashboard`, `Campañas`, `Reportes`, `Auditoría`, `Administración`.
- [ ] 2.2 Eliminar `capture` como módulo principal y mover toda captura bajo campañas.
- [ ] 2.3 Formalizar el menú interno de campaña: `Resumen`, `Activos`, `Auditores`, `Evidencias`, `Conciliación`, `Configuración`.
- [ ] 2.4 Crear shells o placeholders coherentes para `Reportes`, `Auditoría` y `Administración`.

## 3. Domain and Prisma Alignment
- [ ] 3.1 Alinear los estados de campaña al ciclo `draft`, `active`, `in_review`, `completed`, `closed`.
- [ ] 3.2 Alinear los estados de activo al ciclo `pending`, `captured`, `in_review`, `validated`, `not_found`.
- [ ] 3.3 Alinear los estados de conciliación al modelo del PDD.
- [ ] 3.4 Reemplazar los `inventoryModes` actuales por `simple_count`, `full_audit`, `custom`.
- [ ] 3.5 Modelar el método de gestión de activos: manual, carga masiva o ambos.
- [ ] 3.6 Extender `CampaignSettings` para cubrir reglas operativas, evidencia y obligatoriedad por campo.
- [ ] 3.7 Ajustar Prisma schema y crear migraciones/backfills compatibles.
- [ ] 3.8 Revisar y reforzar `tenant_id` en consultas y relaciones críticas.

## 4. Authentication and Session
- [ ] 4.1 Eliminar el login demo y las credenciales hardcoded.
- [ ] 4.2 Integrar Microsoft Entra ID / External ID con MFA usando MSAL.
- [ ] 4.3 Implementar callback/bridge con sesión emitida por servidor.
- [ ] 4.4 Persistir `entraObjectId`, `email`, `tenant`, `role` y membership por tenant.
- [ ] 4.5 Aplicar expiración configurable y bloqueo por inactividad.
- [ ] 4.6 Ajustar la pantalla de login al requisito de botón único `Iniciar sesión con Microsoft`.

## 5. Visual System and UX Guardrails
- [ ] 5.1 Consolidar la paleta y sistema visual del PDD en `shared/ui`.
- [ ] 5.2 Revisar landing, login, dashboard y campañas contra las reglas visuales obligatorias.
- [ ] 5.3 Eliminar KPIs redundantes y dashboards internos innecesarios.
- [ ] 5.4 Asegurar que las interacciones contextuales usen drawer antes que pantalla completa cuando aplique.
- [ ] 5.5 Asegurar consistencia visual entre los tres tipos de inventario.

## 6. Dashboard General
- [ ] 6.1 Implementar KPIs requeridos: campañas, activos, avance global, hallazgos, auditores.
- [ ] 6.2 Mostrar campañas activas con avance y auditores asignados.
- [ ] 6.3 Implementar hallazgos por severidad.
- [ ] 6.4 Incorporar progreso general y feed de última actividad.
- [ ] 6.5 Agregar filtro por cliente y capacidad de exportación.

## 7. Campaigns List
- [ ] 7.1 Convertir el listado actual en tabla de seguimiento alineada al PDD.
- [ ] 7.2 Agregar buscador por campaña, cliente y responsable.
- [ ] 7.3 Agregar filtros por estado, cliente y rango de fechas.
- [ ] 7.4 Mostrar columnas: campaña, cliente, fechas, avance, activos, auditores, estado y última actividad.
- [ ] 7.5 Mantener acceso al detalle al hacer clic en la fila.

## 8. Campaign Wizard v2
- [ ] 8.1 Rehacer `/campaigns/new` como wizard de 3 pasos.
- [ ] 8.2 Implementar paso 1: información general.
- [ ] 8.3 Modelar flags de operación: offline, edición, revisión supervisor y cierre automático.
- [ ] 8.4 Implementar paso 2: configuración de toma física.
- [ ] 8.5 Implementar paso 3: revisión y confirmación con resumen editable.
- [ ] 8.6 Permitir volver a pasos anteriores sin perder contexto.

## 9. Physical Capture Configuration
- [ ] 9.1 Crear la vista crítica de configuración de toma física.
- [ ] 9.2 Implementar el selector lateral de modos.
- [ ] 9.3 Implementar `Conteo simple`.
- [ ] 9.4 Implementar `Auditoría completa`.
- [ ] 9.5 Implementar `Personalizado`.
- [ ] 9.6 Configurar obligatoriedad por campo: obligatorio, opcional, no aplica.
- [ ] 9.7 Soportar reglas operativas y defaults según modo.
- [ ] 9.8 Implementar reset a valores por defecto y guardado.

## 10. Asset Management
- [ ] 10.1 Alinear `Campaña > Activos` como único lugar para crear/administrar activos.
- [ ] 10.2 Mostrar el método de gestión configurado en el header.
- [ ] 10.3 Implementar importación de activos por Excel/CSV con validación previa.
- [ ] 10.4 Implementar descarga de plantilla y campos mínimos requeridos.
- [ ] 10.5 Implementar drawer `Agregar activo` con UX de alta repetitiva.
- [ ] 10.6 Aplicar el límite de 20 activos manuales cuando corresponda.
- [ ] 10.7 Agregar buscador, filtros, contador y paginación contextual.

## 11. Auditors Module
- [ ] 11.1 Crear la vista `Campaña > Auditores`.
- [ ] 11.2 Implementar buscador y alta de auditor.
- [ ] 11.3 Modelar roles de campaña: auditor de terreno y supervisor.
- [ ] 11.4 Mostrar asignación temporal, progreso y última actividad.
- [ ] 11.5 Implementar acciones por fila.

## 12. Mobile Capture Flow
- [ ] 12.1 Reubicar toda captura bajo campaña y activo.
- [ ] 12.2 Asegurar escaneo QR/barcode con cámara móvil en HTTPS/PWA.
- [ ] 12.3 Alinear campos de captura al tipo de inventario activo.
- [ ] 12.4 Soportar foto, ubicación, estado físico, observaciones y cantidad cuando aplique.
- [ ] 12.5 Soportar activos sobrantes en `Auditoría completa` y `Personalizado`.
- [ ] 12.6 Bloquear captura según estado de campaña o política de revisión.

## 13. Asset Detail Drawers
- [ ] 13.1 Implementar drawer continuo sin tabs para `Conteo simple`.
- [ ] 13.2 Implementar tabs `Información`, `Evidencias`, `Historial` para `Auditoría completa`.
- [ ] 13.3 Hacer tabs dinámicos para `Personalizado` según configuración.
- [ ] 13.4 Evitar duplicación de drawers entre modos; usar composición dinámica.

## 14. Evidence Workspace
- [ ] 14.1 Crear la vista `Campaña > Evidencias`.
- [ ] 14.2 Implementar foto principal obligatoria cuando corresponda.
- [ ] 14.3 Implementar fotos adicionales mínimas según configuración.
- [ ] 14.4 Soportar otros adjuntos.
- [ ] 14.5 Soportar observaciones con foto cuando exista diferencia.
- [ ] 14.6 Alinear metadata y hash SHA-256 para almacenamiento y exportación.

## 15. Reconciliation Engine and UI
- [ ] 15.1 Asegurar conciliación automática ante cualquier cambio relevante.
- [ ] 15.2 Formalizar criterios configurables por campaña.
- [ ] 15.3 Implementar KPIs de conciliación requeridos.
- [ ] 15.4 Implementar filtros por estado como pills/tabs.
- [ ] 15.5 Mostrar tabla con diferencia principal y contexto operativo.
- [ ] 15.6 Implementar drawer de conciliación minimalista separado del drawer de activo.
- [ ] 15.7 Implementar acciones `Ver detalle del activo` y `Marcar como revisado`.
- [ ] 15.8 Soportar recálculo masivo al cerrar campaña.

## 16. Findings and Business Timeline
- [ ] 16.1 Formalizar hallazgos como entidad y flujo de revisión.
- [ ] 16.2 Implementar timeline por activo con hitos de negocio.
- [ ] 16.3 Separar `business timeline` de `audit log` técnico.
- [ ] 16.4 Registrar usuario, fecha, hora y contexto breve en cada hito.

## 17. Campaign Report and Closure
- [ ] 17.1 Crear la vista `Campaña > Reporte final`.
- [ ] 17.2 Implementar tabs internas del reporte: resumen, no encontrados, sobrantes, auditores, evidencias.
- [ ] 17.3 Implementar KPIs de cierre sin duplicar las del resumen.
- [ ] 17.4 Implementar tabla de activos que requieren revisión.
- [ ] 17.5 Implementar exportación Excel.
- [ ] 17.6 Implementar exportación PDF.
- [ ] 17.7 Implementar exportación ZIP de evidencias con manifest.
- [ ] 17.8 Implementar modal destructivo de cierre con checkbox obligatorio.

## 18. Reports, Audit and Administration Main Modules
- [ ] 18.1 Crear el módulo principal `Reportes` para acceso cross-campaign.
- [ ] 18.2 Crear el módulo principal `Auditoría` para logs, exportaciones y trazabilidad.
- [ ] 18.3 Crear el módulo principal `Administración` para tenants, clientes y usuarios.
- [ ] 18.4 Alinear permisos y visibilidad por rol.

## 19. PWA and Offline (P1)
- [ ] 19.1 Configurar service worker para experiencia PWA.
- [ ] 19.2 Implementar cola local de capturas.
- [ ] 19.3 Sincronizar al reconectar.
- [ ] 19.4 Resolver conflictos por timestamp y versión.
- [ ] 19.5 Garantizar que la UX móvil siga siendo operable offline.

## 20. Security and Azure Hardening
- [ ] 20.1 Endurecer manejo de secretos y variables de entorno.
- [ ] 20.2 Validar conectividad Azure SQL por tenant-aware queries.
- [ ] 20.3 Preparar almacenamiento Azure Blob para evidencias.
- [ ] 20.4 Preparar criterios de Azure Front Door Premium + WAF para despliegue serio.
- [ ] 20.5 Revisar TLS, expiración de sesión y trazabilidad de exportaciones.

## 21. Quality, Migration and Release
- [ ] 21.1 Añadir pruebas de dominio para estados, wizard y conciliación.
- [ ] 21.2 Añadir pruebas de integración para auth, campañas, activos y capturas.
- [ ] 21.3 Validar lint, typecheck y build en cada slice.
- [ ] 21.4 Preparar plan de migración desde la base actual a la estructura alineada al PDD.
- [ ] 21.5 Definir criterios de aceptación por módulo antes de desplegar a producción.
