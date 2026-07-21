# Proposal: Align AssetLens to PDD-Dev v2.0

## Intent
Realinear el producto y la base de código con el documento [PDD_NovusOne_AssetLens_Desarrollo (1).docx](/Users/joseeduardorodriguesgodinho/Documents/inventarioNovusOne/inventarionovusone/docs/PDD_NovusOne_AssetLens_Desarrollo%20(1).docx), tomándolo como fuente única de verdad funcional, UX y arquitectura de producto.

Este cambio no es un ajuste incremental de pantallas. Es una corrección integral de arquitectura, navegación, estados de dominio, autenticación, módulos internos de campaña y comportamiento operativo para que el producto refleje el MVP definido por NovusOne.

## Why Now
La base actual ya avanzó en campañas, activos, capturas, evidencias y conciliación, pero todavía presenta divergencias críticas respecto del PDD:

- `capture` existe como módulo principal independiente, violando la regla de que todo vive dentro de una campaña.
- El login actual sigue siendo demo/hardcoded y no cumple con Entra ID / External ID + MFA.
- Los tipos de inventario y los estados actuales no coinciden con el vocabulario del PDD.
- La creación de campañas no es un wizard de 3 pasos.
- La experiencia visual todavía mezcla decisiones previas con un sistema más administrativo que el definido en el documento.

## Scope
In scope:
- Alinear navegación principal e interna de campaña al PDD.
- Migrar autenticación a Microsoft Entra ID / External ID con MFA.
- Ajustar Prisma, dominio y estados del producto al modelo del PDD.
- Implementar el wizard de campaña y la configuración de toma física.
- Rehacer los módulos internos de campaña: resumen, activos, auditores, evidencias, conciliación y configuración.
- Implementar reporte final, cierre de campaña y trazabilidad de negocio.
- Dejar preparado el camino para PWA móvil y sincronización offline.

Out of scope:
- Integraciones directas con ERP.
- Firma digital certificada.
- App nativa iOS/Android.
- Facturación.
- BI embebido.
- IA para reconocimiento automático.
- Multiidioma completo.

## Product Rules Adopted from the PDD
- Todo pertenece a una campaña.
- Solo existen como módulos principales: `Dashboard`, `Campañas`, `Reportes`, `Auditoría`, `Administración`.
- Dentro de una campaña solo existen: `Resumen`, `Activos`, `Auditores`, `Evidencias`, `Conciliación`, `Configuración`.
- Menos métricas, más decisiones.
- Drawer antes que pantalla completa cuando sea posible.
- Conciliación siempre automática y en tiempo real.
- La UI se adapta al tipo de inventario; no se duplican pantallas por modo.

## Capabilities

### New Capabilities
- `entra-auth-foundation`
- `campaign-wizard-v2`
- `physical-capture-configuration`
- `campaign-assets-management`
- `campaign-auditors-management`
- `campaign-evidence-workspace`
- `real-time-reconciliation`
- `campaign-final-report`
- `business-timeline-traceability`
- `tenant-admin-audit-reports-shell`

### Changed Capabilities
- `dashboard-general`
- `campaigns-list-page`
- `campaign-detail-page`
- `mobile-capture-flow`
- `campaign-lifecycle`
- `inventory-mode-model`

## Approach
Ejecutar la alineación en slices ordenados por dependencia:

1. Dominio, Prisma, estados y navegación.
2. Autenticación y seguridad tenant-aware.
3. Wizard de campaña y configuración crítica.
4. Módulos internos de campaña.
5. Reportes, auditoría, administración y endurecimiento.

La prioridad es corregir primero las decisiones estructurales equivocadas, para que las siguientes pantallas no se monten sobre una arquitectura contraria al PDD.
