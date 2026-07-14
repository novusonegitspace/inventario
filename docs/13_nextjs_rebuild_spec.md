# AssetLens Next.js Rebuild Spec

## Objetivo

Redisenar AssetLens como una plataforma mas ordenada, mantenible y lista para evolucionar, rescatando lo mejor del MVP actual y reemplazando sus puntos debiles por una arquitectura moderna basada en Next.js.

El objetivo no es "migrar pantalla por pantalla". El objetivo es rehacer la base tecnica sin perder las reglas de negocio correctas ya descubiertas.

## Lo que si vale la pena rescatar del proyecto actual

### Reglas de negocio no negociables

- Todo vive dentro de una campana.
- Toda entidad de negocio tiene `tenant_id`.
- Activos, capturas, evidencias, conciliacion, hallazgos, auditores y timeline tienen `campaign_id`.
- `audit_log` es append-only.
- El resultado de conciliacion se persiste como snapshot recalculable.
- El cierre de campana bloquea nuevas ediciones y nuevas capturas.

### Capacidades funcionales ya bien definidas

- Campanas con ciclo `draft -> active -> closed`.
- Configuracion por campana para modo de inventario y criterios de conciliacion.
- Maestro de activos por campana.
- Captura movil con codigo, foto, geolocalizacion y observaciones.
- Evidencias con `sha256`, metadata y trazabilidad.
- Conciliacion automatica con estados claros.
- Timeline por campana.
- Exportaciones y reportes.
- Multitenancy y RBAC desde identidad Microsoft.

### Activos tecnicos a rescatar

- Modelo de dominio actual.
- Prisma schema como punto de partida del modelo relacional.
- Motor de conciliacion puro y testeable.
- Documentacion de seguridad, despliegue y operacion.
- Infraestructura Azure en Bicep como base inicial.

## Lo que no debe pasar al rediseño

- Store en memoria como runtime principal.
- Un frontend grande y monolitico con demasiada logica en un solo archivo.
- Mezcla difusa entre demo, MVP y productivo.
- CI/CD desalineado con la estructura real del repo.
- Servicios de exportacion y evidencia que solo generan metadata sin integracion real.
- Validaciones y contratos repartidos sin una capa de aplicacion clara.

## Principios de arquitectura objetivo

- Monorepo ordenado por responsabilidades, no por accidente historico.
- Next.js App Router como plataforma principal de producto.
- Dominio aislado del framework.
- Server Components por defecto; Client Components solo donde aporten valor real.
- Mutaciones sincronas simples con Server Actions o Route Handlers, segun el caso.
- Procesos pesados o asincronos fuera del request cycle.
- Seguridad y tenant isolation resueltos en servidor, nunca en cliente.
- Contratos tipados y validados en el borde.
- Observabilidad, auditoria y trazabilidad como requisitos de primer nivel.

## Arquitectura recomendada

### Decisiones principales

- Frontend y BFF: Next.js App Router.
- Autenticacion web: Auth.js con Microsoft Entra ID.
- ORM: Prisma.
- Base de datos: mantener Azure SQL como continuidad P0.
- Almacenamiento de evidencias: Azure Blob Storage.
- Procesamiento asincrono: worker separado para exportaciones, importaciones masivas y tareas pesadas.
- Cache y revalidacion: primitives nativas de Next.js y cache invalidation dirigida.

### Decision importante

No recomiendo meter toda la logica en Route Handlers del mismo proyecto y dar por resuelto el backend. Para CRUD sincrono, Next.js funciona bien como BFF. Para importaciones, zips, reportes pesados y reconciliaciones masivas, conviene un `worker` o servicio de background separado.

## Estructura propuesta del monorepo

```text
assetlens/
  apps/
    web/                    Next.js App Router
    worker/                 Procesos asincronos y colas
  packages/
    domain/                 Entidades, value objects, reglas puras
    application/            Casos de uso, puertos y orquestacion
    db/                     Prisma client, repositorios, transacciones
    auth/                   Helpers Auth.js, RBAC, tenant context
    storage/                Azure Blob adapters, hashing, manifests
    ui/                     Design system y componentes compartidos
    validation/             Schemas Zod de entrada/salida
    config/                 Config comun, env parsing, feature flags
    testing/                Factories, mocks, fixtures, helpers e2e
  infra/
    bicep/                  Infra Azure
  docs/
    ...
```

## Arquitectura por capas

### 1. `packages/domain`

Debe contener:

- Tipos de dominio.
- Invariantes de negocio.
- Estados de campana.
- Motor de conciliacion.
- Reglas puras de comparacion y validacion de estados.

No debe contener:

- Prisma.
- Next.js.
- Azure SDK.
- `fetch`, `Request`, `Response`.

### 2. `packages/application`

Debe contener:

- Casos de uso.
- Servicios de aplicacion.
- Interfaces de repositorio.
- Politicas de autorizacion.
- Casos de uso auditables.

Ejemplos:

- `CreateCampaign`
- `UpdateCampaignSettings`
- `ImportAssets`
- `CreateCapture`
- `UploadEvidence`
- `RecalculateCampaignReconciliation`
- `CloseCampaign`
- `GenerateFinalReport`

### 3. `packages/db`

Debe contener:

- `schema.prisma`
- Prisma Client singleton
- Repositorios concretos
- Helpers de transaccion
- Mappers entre entidades Prisma y dominio

### 4. `apps/web`

Responsabilidades:

- Rutas UI.
- BFF HTTP.
- Session handling.
- Server rendering.
- Captura movil.
- Formularios y modales.

No debe convertirse en una bolsa de reglas de negocio. La regla es simple: la UI compone, la aplicacion decide.

### 5. `apps/worker`

Responsabilidades:

- Importacion Excel/CSV real.
- Generacion de PDF.
- Generacion de ZIP de evidencias.
- Reconciliaciones masivas si crecen en costo.
- Reintentos e idempotencia.

## Modelo funcional objetivo

### Modulos principales

- Dashboard
- Campanas
- Reportes
- Auditoria
- Administracion

### Modulos dentro de campana

- Resumen
- Activos
- Auditores
- Evidencias
- Conciliacion
- Configuracion
- Timeline

### Alcance P0 recomendado

- Login con Microsoft Entra ID.
- Tenant context real desde sesion.
- CRUD de campanas.
- Configuracion por campana.
- Carga manual de activos.
- Importacion de maestro en segundo plano.
- Captura movil.
- Upload real de evidencia a Blob.
- Conciliacion automatica.
- Revision de diferencias.
- Cierre de campana.
- Reporte final.
- Exportaciones con jobs persistidos.
- Audit log y timeline.

### P1 preparado

- Offline sync bidireccional real.
- Aprobacion de supervisor.
- Notificaciones.
- Scoring avanzado por criterios.
- Campos personalizados mas ricos.
- Dashboards analiticos.

## Rutas de aplicacion recomendadas

```text
/(public)
  /login

/(app)
  /dashboard
  /campaigns
  /campaigns/[campaignId]
  /campaigns/[campaignId]/assets
  /campaigns/[campaignId]/auditors
  /campaigns/[campaignId]/evidence
  /campaigns/[campaignId]/reconciliation
  /campaigns/[campaignId]/settings
  /campaigns/[campaignId]/timeline
  /capture/[campaignId]
  /reports
  /admin
```

## API/BFF recomendado

### Estrategia

- Mantener una API clara bajo `/api/v1`.
- Usar Route Handlers para endpoints JSON, uploads y consumo desde movil.
- Usar Server Actions solo para formularios internos simples donde agreguen ergonomia.
- No mezclar ambos patrones sin criterio.

### Endpoints P0 a conservar

- `GET /api/v1/me`
- `GET /api/v1/tenants/current`
- `GET /api/v1/campaigns`
- `POST /api/v1/campaigns`
- `GET /api/v1/campaigns/:id`
- `PATCH /api/v1/campaigns/:id`
- `POST /api/v1/campaigns/:id/close`
- `GET /api/v1/campaigns/:id/settings`
- `PUT /api/v1/campaigns/:id/settings`
- `GET /api/v1/campaigns/:id/assets`
- `POST /api/v1/campaigns/:id/assets`
- `POST /api/v1/campaigns/:id/assets/import`
- `POST /api/v1/campaigns/:id/captures`
- `POST /api/v1/campaigns/:id/captures/:captureId/evidence`
- `GET /api/v1/campaigns/:id/reconciliation`
- `POST /api/v1/campaigns/:id/reconciliation/recalculate`
- `POST /api/v1/campaigns/:id/reconciliation/:assetId/mark-reviewed`
- `GET /api/v1/campaigns/:id/timeline`
- `GET /api/v1/audit-log`
- `POST /api/v1/campaigns/:id/export/excel`
- `POST /api/v1/campaigns/:id/export/pdf`
- `POST /api/v1/campaigns/:id/export/evidence-zip`

### Contratos y validacion

- Todo input entra por Zod.
- Todo output importante debe tener shape estable y tipado.
- `tenant_id` y `user_id` nunca vienen desde el body.
- Errores con formato consistente y codigos semanticos.

## Autenticacion y autorizacion

### Recomendacion

Usar Auth.js con proveedor Microsoft Entra ID para resolver login web y sesion. Esto alinea bien con Next.js y evita duplicar manejo de tokens en el cliente.

### Claims requeridos en sesion

- `tenantId`
- `userId`
- `email`
- `roles`

### Roles P0

- `tenant_admin`
- `project_lead`
- `supervisor`
- `field_auditor`
- `client`

### Reglas

- Middleware solo para proteccion basica de rutas.
- RBAC real en capa servidor y casos de uso.
- Toda lectura/escritura debe estar scopeada por `tenantId`.
- `field_auditor` puede capturar; no debe administrar campanas.
- `client` puede leer reportes y resultados permitidos, no operar datos internos.

## Modelo de datos recomendado

### Entidades P0

- `tenants`
- `users`
- `tenant_users`
- `clients`
- `campaigns`
- `campaign_settings`
- `campaign_inventory_fields`
- `campaign_reconciliation_criteria`
- `asset_master_rows`
- `assets`
- `asset_captures`
- `asset_capture_conditions`
- `evidence_files`
- `campaign_auditors`
- `assignments`
- `reconciliation_results`
- `findings`
- `business_timeline_events`
- `audit_log`
- `import_jobs`
- `export_jobs`

### Reglas relacionales minimas

- Indices compuestos por `(tenant_id, campaign_id)` donde aplique.
- Unicidad de `asset_tag` por tenant y campana.
- `campaign_settings` uno a uno por campana.
- `audit_log` append-only.
- `reconciliation_results` persiste snapshot, no solo vista calculada en vivo.

## Conciliacion

### Estados que deben mantenerse

- `conciliado`
- `conciliado_con_diferencias`
- `no_encontrado`
- `sobrante`
- `pendiente`

### Criterios P0

- `location`
- `responsible`
- `physicalCondition`
- `costCenter`
- `serialNumber`

### Eventos que disparan recalculo

- Creacion de captura.
- Edicion de activo.
- Cambio de configuracion de campana.
- Cierre de campana.
- Importacion de maestro.

### Regla de implementacion

El motor de conciliacion debe quedarse como modulo puro de dominio. No debe depender de Prisma ni de Next.js.

## Evidencias y archivos

### Requisitos P0

- Validacion de extension, MIME y tamano.
- Calculo de `sha256` al recibir archivo.
- Persistencia de metadata.
- Subida real a Blob Storage.
- Nombre de blob deterministico o trazable.
- Relacion opcional con `asset_id` y `capture_id`.

### Recomendacion tecnica

- El upload HTTP entra por Route Handler.
- La escritura a Blob vive en `packages/storage`.
- Si hay antivirus o inspeccion futura, el archivo entra en estado `uploaded_pending_scan`.

## Frontend y UX

### Lineamientos

- Mobile-first.
- Dashboard y paginas de lectura con Server Components.
- Captura movil como Client Components dedicados.
- Formularios acotados y tipados.
- Modales y drawers solo donde realmente ayuden a mantener contexto.
- Evitar un `App.tsx` gigante o pantallas con demasiadas responsabilidades.

### Estado de datos

- Preferir datos cargados en servidor para vistas de lectura.
- Usar estado cliente solo para interaccion, captura, borradores y offline.
- Introducir TanStack Query solo en zonas de alta interaccion o polling; no como dependencia universal por defecto.

### PWA

- `manifest.ts`
- service worker
- cache de shell
- IndexedDB para cola offline
- estrategia de reintento
- fallback manual si `BarcodeDetector` no existe

## Observabilidad y auditoria

### Debe existir

- Logging estructurado.
- Correlation ID por request.
- Audit log funcional.
- Timeline de negocio separado del log tecnico.
- Eventos clave:
  - `campaign.created`
  - `campaign.closed`
  - `asset.created`
  - `capture.created`
  - `evidence.uploaded`
  - `reconciliation.recalculated`
  - `export.created`

### Azure

- Application Insights para trazas, errores y metricas.
- Alertas operativas para fallos de login, jobs y uploads.

## Despliegue recomendado

### Base Azure

- Next.js self-hosted en App Service Linux o contenedor.
- Worker en App Service separado o Container Apps.
- Azure Blob Storage para evidencias.
- Azure SQL para datos transaccionales.
- Key Vault para secretos.
- Front Door para entrada publica.
- Bicep como fuente de verdad de infraestructura.

### Variables y secretos

- Un solo contrato de variables por entorno.
- Validacion temprana de env al iniciar.
- Nada de secretos embebidos en codigo o workflows.

## Testing target

### Unit

- Motor de conciliacion.
- Reglas de cierre de campana.
- Politicas RBAC.
- Validaciones Zod.

### Integracion

- Route Handlers.
- Repositorios Prisma.
- Upload de evidencia.
- Jobs de import/export.

### E2E

- Login.
- Crear campana.
- Crear y editar activo.
- Captura movil.
- Cierre de campana.
- Exportaciones.

### Manual

- Camara real.
- Geolocalizacion real.
- Navegadores sin `BarcodeDetector`.
- Modo offline y reintento.

## Decision sobre Next.js y backend

### Recomendacion concreta

Usar Next.js como:

- shell de producto
- frontend principal
- BFF y API sincronica

No usar Next.js como sustituto ingenuo de todo backend asincrono. Cuando una operacion sea pesada, multipaso o potencialmente lenta, debe pasar por job persistido y worker.

## Plan de migracion recomendado

### Fase 1. Fundacion

- Crear nuevo monorepo limpio.
- Definir `packages/domain`, `application`, `db`, `auth`, `validation`.
- Migrar motor de conciliacion.
- Migrar modelo Prisma.
- Definir contrato de env y CI basico.

### Fase 2. Plataforma web

- Montar Next.js App Router.
- Configurar Auth.js con Entra ID.
- Implementar layout protegido.
- Implementar dashboard, listado de campanas y detalle de campana.

### Fase 3. Core transaccional

- CRUD de campanas.
- Configuracion.
- Activos.
- Auditores.
- Timeline.

### Fase 4. Captura y evidencias

- Captura movil.
- Upload a Blob.
- Reconciliacion automatica.
- Cola offline basica.

### Fase 5. Jobs

- Importacion real.
- Exportaciones reales.
- Worker y colas.

### Fase 6. Hardening

- Observabilidad completa.
- permisos finos
- retry policy
- pruebas e2e
- CI/CD final

## Criterios de exito

- El sistema corre sin store en memoria.
- Las reglas de negocio originales se mantienen.
- El dominio no depende del framework.
- El flujo movil funciona bien en telefono.
- La seguridad multitenant no depende del cliente.
- Los jobs pesados no bloquean requests web.
- El repo queda entendible por otro equipo sin explicacion oral.

## Recomendaciones de implementacion

- No migrar el frontend actual tal cual; redisenar por feature slices.
- No mover la logica de `TenantGuard` al cliente; convertirla en session resolution del servidor.
- No portar el `App.tsx` actual; rehacer vistas por ruta y por modulo.
- Mantener la nomenclatura de dominio actual salvo que exista una razon fuerte para simplificar.
- Conservar Bicep y scripts utiles, pero rehacer CI/CD alrededor de la nueva estructura real.

## Decisiones abiertas

- Mantener Azure SQL o pasar a PostgreSQL si no existe dependencia corporativa.
- Definir si import/export usa Queue Storage, Service Bus o DB polling.
- Definir si el worker vive como app separada o como proceso paralelo del mismo despliegue.
- Definir alcance real de offline P0 vs P1.

## Referencias usadas para esta propuesta

- Next.js App Router, Server and Client Components, Route Handlers y PWA guides.
- Auth.js con Microsoft Entra ID.
- Documentacion y dominio ya presentes en este repo.
