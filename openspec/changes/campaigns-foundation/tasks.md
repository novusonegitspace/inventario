# Tasks

## 1. Campaigns Slice Structure
- [x] 1.1 Crear la estructura `src/features/campaigns` con carpetas `domain`, `application`, `infrastructure` y `ui`.
- [x] 1.2 Definir el tipo `Campaign` y el estado `CampaignStatus`.
- [x] 1.3 Agregar datos mock iniciales y un repositorio temporal del slice.

## 2. Campaigns UI
- [x] 2.1 Crear la ruta `/campaigns` con listado de campañas.
- [x] 2.2 Crear componentes de dominio para card o fila de campaña y badge de estado.
- [x] 2.3 Incorporar métricas básicas del listado: estado, progreso, activos y auditores.

## 3. Campaign Creation
- [x] 3.1 Crear la ruta `/campaigns/new`.
- [x] 3.2 Implementar formulario inicial con validación tipada.
- [x] 3.3 Conectar el formulario al caso de uso `create-campaign`.

## 4. Campaign Detail
- [x] 4.1 Crear la ruta `/campaigns/[campaignId]`.
- [x] 4.2 Mostrar resumen base de la campaña y navegación hacia módulos futuros.
- [x] 4.3 Resolver estados no encontrados con UX consistente.

## 5. Lifecycle Foundation
- [x] 5.1 Centralizar las reglas y labels del estado `draft | active | closed`.
- [x] 5.2 Preparar acciones y affordances de UI compatibles con transiciones futuras.
- [x] 5.3 Evitar edición y captura cuando la campaña esté cerrada, aunque inicialmente sea solo a nivel de presentación.

## 6. Quality and Alignment
- [x] 6.1 Reutilizar componentes shared sin mover reglas de `campaigns` a `shared`.
- [x] 6.2 Validar lint y build.
- [x] 6.3 Revisar que el slice quede listo para cambiar de mocks a persistencia real sin reestructurar rutas ni componentes.
