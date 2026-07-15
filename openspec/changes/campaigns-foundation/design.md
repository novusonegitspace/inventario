# Design: Campaigns Foundation

## Overview
`campaigns` será el primer slice de producto implementado sobre la nueva base de Next.js. La meta no es solo abrir pantallas, sino fijar una forma de trabajo compatible con screaming architecture: el dominio debe ser visible en la estructura del código y la UI solo debe componer ese dominio.

## Architectural Direction

### Route shape
- `/campaigns`
- `/campaigns/new`
- `/campaigns/[campaignId]`

### Proposed code organization
```text
src/
  features/
    campaigns/
      domain/
        campaign.ts
        campaign-status.ts
      application/
        list-campaigns.ts
        create-campaign.ts
        get-campaign-detail.ts
      infrastructure/
        campaign-repository.ts
        mock-campaigns.ts
      ui/
        campaign-list.tsx
        campaign-card.tsx
        campaign-form.tsx
        campaign-status-badge.tsx
        campaign-detail-header.tsx
```

### Boundary rules
- `domain/` define tipos, estados e invariantes básicas.
- `application/` expone casos de uso del slice.
- `infrastructure/` aloja el origen de datos temporal mientras no exista persistencia real.
- `ui/` contiene componentes específicos de `campaigns`.
- `app/` solo conecta rutas con los casos de uso y la composición visual.

## Data Model for the Slice

### Campaign
- `id`
- `tenantId`
- `name`
- `code`
- `status`
- `clientName`
- `siteName`
- `inventoryMode`
- `auditorCount`
- `assetCount`
- `progressPercentage`
- `scheduledStartAt`
- `scheduledEndAt`
- `createdAt`
- `updatedAt`

### CampaignStatus
- `draft`
- `active`
- `closed`

## UI Direction
- El listado debe comunicar avance operativo, estado y contexto sin parecer una tabla administrativa genérica.
- El detalle debe funcionar como punto de entrada a módulos futuros: resumen, activos, auditores, evidencias, conciliación, configuración y timeline.
- La creación debe priorizar pocos campos obligatorios para no bloquear el arranque.

## Implementation Notes
- En esta etapa se aceptan mocks estructurados para acelerar el slice.
- Los mocks deben entrar por un repositorio del dominio, no por imports directos desde `app/`.
- El estado de campaña debe mapearse a UI con un componente de dominio como `campaign-status-badge`.
- El cambio debe quedar listo para reemplazar el repositorio mock por Prisma sin reescribir la UI.

## Risks
- Meter lógica de dominio directamente en `page.tsx` y perder el patrón antes de abrir el segundo slice.
- Diseñar el listado solo como demo visual y no como base real de operación.
- Acoplar la creación de campañas a formularios o schemas shared en vez de dejar claro el lenguaje del dominio.
