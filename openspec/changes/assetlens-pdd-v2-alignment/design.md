# Design: AssetLens PDD v2.0 Alignment

## Overview
El objetivo es convertir la app actual en la implementación fiel del PDD-Dev v2.0. La base técnica existente en Next.js, Prisma y Azure SQL sigue siendo válida, pero debe reorganizarse para reflejar:

- arquitectura de producto centrada en campaña
- autenticación real con Microsoft Entra ID / External ID
- estados y tipos de inventario oficiales
- módulos internos de campaña definidos por el PDD
- minimalismo visual y decisiones UX obligatorias

## Source of Truth
- Documento rector: [PDD_NovusOne_AssetLens_Desarrollo (1).docx](/Users/joseeduardorodriguesgodinho/Documents/inventarioNovusOne/inventarionovusone/docs/PDD_NovusOne_AssetLens_Desarrollo%20(1).docx)
- Fecha del documento: julio de 2026
- Clasificación adoptada para desarrollo: interno, handoff a dev team

## Architectural Direction

### Product information architecture

#### Main modules
- `/dashboard`
- `/campaigns`
- `/reports`
- `/audit`
- `/admin`

#### Campaign workspace
- `/campaigns/[campaignId]` -> `Resumen`
- `/campaigns/[campaignId]/assets`
- `/campaigns/[campaignId]/auditors`
- `/campaigns/[campaignId]/evidence`
- `/campaigns/[campaignId]/reconciliation`
- `/campaigns/[campaignId]/settings`

#### Explicit removals / deprecations
- `/capture` deja de ser un módulo principal. La captura solo se inicia desde una campaña activa y desde activos/captura de terreno asociada.
- Cualquier acceso directo a `assets`, `evidence`, `reconciliation` o `traceability` fuera del contexto de campaña debe desaparecer.

### Screaming architecture
La estructura por dominio sigue siendo correcta, pero debe reordenarse y ampliarse para que el producto grite el negocio del PDD:

```text
src/
  features/
    auth/
    dashboard/
    campaigns/
      domain/
      application/
      infrastructure/
      ui/
    campaign-settings/
    assets/
    auditors/
    captures/
    evidence/
    reconciliation/
    findings/
    reporting/
    audit/
    administration/
```

Regla de frontera:
- `shared/` solo aloja primitives, layout system y utilidades verdaderamente transversales.
- Ninguna regla de campaña, conciliación o captura vive en `shared/`.

## Domain Alignment

### Campaign state model
El ciclo actual `draft | active | closed` es insuficiente.

Nuevo ciclo objetivo:
- `draft`
- `active`
- `in_review`
- `completed`
- `closed`

Uso:
- `draft`: campaña en preparación
- `active`: captura habilitada
- `in_review`: supervisor revisando y bloqueando nuevas tomas según política
- `completed`: operación terminada, lista para reporte/cierre
- `closed`: cierre definitivo e irreversible salvo reapertura explícita

### Asset state model
Nuevo estado de activo:
- `pending`
- `captured`
- `in_review`
- `validated`
- `not_found`

### Reconciliation state model
Se mantiene y formaliza:
- `conciliated`
- `conciliated_with_differences`
- `not_found`
- `surplus`
- `pending`

El naming de código puede seguir en inglés o snake case consistente, pero la semántica debe mapear 1:1 al PDD.

### Inventory mode model
Los modos actuales no reflejan el PDD.

Nuevo modelo:
- `simple_count`
- `full_audit`
- `custom`

Regla crítica:
- `master_based_count` o equivalentes NO existen como tipo separado.
- El maestro es un método de carga, no un tipo de inventario.

### Asset management method
Por campaña y por tipo:
- `bulk_only`
- `manual_only`
- `hybrid`

Regla:
- los activos se administran únicamente desde `Campaña > Activos`
- configuración define reglas, no crea activos

## Prisma and Persistence Alignment

### Existing schema leverage
La base actual ya contiene modelos relevantes:
- `Tenant`
- `User`
- `TenantUser`
- `Client`
- `Campaign`
- `CampaignSettings`
- `CampaignInventoryField`
- `CampaignReconciliationCriterion`
- `AssetMasterRow`
- `Asset`
- `CampaignAuditor`
- `Assignment`
- `AssetCapture`
- `EvidenceFile`
- `ReconciliationResult`
- `Finding`
- `BusinessTimelineEvent`
- `AuditLog`
- `ImportJob`
- `ExportJob`

### Required Prisma changes
- Alinear enums/strings de estados y tipos de inventario.
- Extender `Campaign` para soportar `in_review` y `completed`.
- Formalizar `manual asset limit` por configuración.
- Agregar flags de configuración del wizard paso 1:
  - allowOfflineCapture
  - allowEditRecords
  - requireSupervisorReview
  - autoCloseCampaign
- Formalizar configuración de captura por campo:
  - required / optional / not_applicable
- Soportar modo `surplus allowed` por tipo.
- Soportar `primary photo required`, `additional photo minimum`, `other evidence rules`.
- Formalizar `business timeline` como hitos de negocio y no logs técnicos.
- Asegurar `tenant_id` en todos los modelos críticos y consultas.

### Migration strategy
- Crear migración Prisma dedicada para realinear estados y columnas.
- Incluir script de backfill para estados existentes.
- Evitar cambios destructivos antes de tener mapeo desde el modelo actual.

## Authentication and Security Design

### Target auth stack
- Microsoft Entra ID para usuarios internos
- Microsoft Entra External ID para invitados/externos
- MFA obligatorio definido por política
- sesión servidor-validada en Next.js

### Recommended implementation
- Cliente: `@azure/msal-browser` + `@azure/msal-react`
- Servidor: callback/controlador de sesión propia de la app
- Persistencia local: cookie segura de sesión emitida por servidor

### Session requirements
- JWT o sesión equivalente con expiración configurable
- bloqueo automático por inactividad
- mapeo de `entraObjectId`, `email`, `tenant`, `role`
- membership por `tenantUser`

### Roles
- `tenant_admin`
- `project_lead`
- `supervisor`
- `field_auditor`
- `client`

Los permisos deben filtrarse por campaña y tenant.

## UX and Visual System

### Visual direction
Adoptar en firme la paleta del PDD:
- `#FFFFFF`
- `#F7F8FA`
- `#14375A`
- `#1F9E7A`
- `#2D2D2D`
- `#E4E7EB`

### UX guardrails
- No repetir KPIs entre pantallas.
- No usar dashboards internos redundantes.
- Cada pantalla justifica su existencia.
- Drawers antes que pantallas completas cuando la interacción sea contextual.
- Tabs solo cuando la información realmente cambie de naturaleza.
- El tipo de inventario decide la forma del drawer, campos y evidencias.

### Current UI implications
- La landing y el dashboard deben seguir el estilo claro empresarial.
- Los KPIs del dashboard deben racionalizarse según el PDD.
- Las vistas internas de campaña deben reducir ruido y enfatizar acciones.

## Feature Design by Stream

### 1. Dashboard general
Debe mostrar:
- campañas totales
- activos totales
- avance global
- hallazgos
- auditores
- campañas activas
- actividad reciente
- filtros por cliente
- exportación

No debe duplicar métricas ya visibles dentro de campañas.

### 2. Campaigns list
Debe evolucionar de listado simple a tabla orientada a seguimiento:
- buscador
- filtros por estado, cliente y fechas
- columnas: campaña, cliente, fechas, avance, activos, auditores, estado, última actividad

### 3. Campaign creation wizard
Tres pasos:
- paso 1: información general
- paso 2: configuración de toma física
- paso 3: revisión y confirmación

Arquitectura recomendada:
- estado del wizard en server/client boundary controlado
- borrador persistible
- validaciones por paso
- resumen editable antes de confirmar

### 4. Physical capture configuration
Vista crítica del PDD.

Debe soportar:
- selector lateral de modo
- contenido dinámico por tipo
- guardar y resetear defaults
- configuración de obligatoriedad por campo
- reglas operativas visibles solo cuando corresponda

### 5. Assets module
Debe reflejar método de gestión configurado:
- manual
- carga masiva
- ambos

Requisitos:
- contador `X de 20` cuando aplica
- importación Excel/CSV
- drawer lateral para alta manual
- tabla contextual a la campaña

### 6. Auditors module
Requisitos:
- alta de auditores
- rol en campaña
- rango de asignación
- progreso
- última actividad

### 7. Mobile capture
Requisitos MVP:
- escaneo QR/barcode desde cámara
- foto
- ubicación
- estado físico
- observaciones
- comportamiento condicionado por tipo de inventario

Ruta:
- siempre descendiente de campaña y activo

### 8. Asset detail drawers
- `simple_count`: drawer continuo, sin tabs
- `full_audit` y `custom`: tabs dinámicos `Información`, `Evidencias`, `Historial`

### 9. Evidence
Debe permitir:
- foto principal
- fotos adicionales mínimas según configuración
- otros adjuntos
- observación con foto cuando exista diferencia

### 10. Reconciliation
Motor:
- automático
- en tiempo real
- configurable por criterios
- recalculable

Vista:
- KPIs operativos
- pills/tabs por estado
- tabla de diferencias
- drawer de conciliación separado del drawer de activo

### 11. Reporting and campaign closure
Debe introducir:
- vista de reporte final
- tabs internas del reporte
- exportación Excel/PDF/ZIP
- cierre irreversible con checkbox explícito

### 12. Audit and administration
Se deben abrir los módulos principales aunque sea con alcance MVP inicial:
- `Reports`
- `Audit`
- `Administration`

Mínimo:
- shells y navegación coherentes
- placeholders funcionales con copy correcto si la capacidad aún no está completa

## Offline and PWA Strategy

### P0
- captura móvil responsive
- soporte cámara en navegador móvil

### P1
- service worker
- cola local de capturas
- sincronización al reconectar
- resolución de conflictos por timestamp/version

## Technical Quality Gates
- `tenant_id` obligatorio en toda consulta crítica
- audit trail append-only
- tipos de dominio separados de Prisma mappers
- cada ruta compone casos de uso; no hace lógica de negocio inline
- lint, typecheck y build verdes
- UX consistente entre inventory modes

## Rollout Plan

### Phase 1
- dominio, navegación, Prisma, estados, shells principales

### Phase 2
- auth Entra ID / External ID + MFA

### Phase 3
- wizard de campaña y configuración de toma física

### Phase 4
- módulos internos: activos, auditores, evidencias, conciliación

### Phase 5
- reporte final, cierre, auditoría, administración

### Phase 6
- PWA offline P1, endurecimiento y QA final

## Risks
- Seguir agregando pantallas sobre la arquitectura actual y profundizar divergencias.
- Cambiar UI sin alinear dominio/estados, generando deuda funcional.
- Introducir MSAL solo en cliente sin sesión robusta de servidor.
- Mantener rutas principales que contradigan la regla “todo vive dentro de una campaña”.
- Repetir métricas y mini-dashboards internos, violando las reglas UX del PDD.
