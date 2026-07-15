# Proposal: Build Campaigns Foundation

## Intent
Construir el primer slice real del dominio sobre el rebuild de AssetLens, empezando por `campaigns` como eje del producto. Este cambio debe establecer la base funcional y estructural para que luego `settings`, `assets`, `captures`, `reconciliation` y `reports` puedan crecer sobre una campaña real.

## Scope
In scope:
- Listado de campañas con estado y metadata clave.
- Creación de campañas con validación básica.
- Vista de detalle de campaña.
- Modelo inicial del ciclo `draft -> active -> closed`.
- Estructura screaming architecture para el dominio `campaigns`.
- Datos mockeados o in-memory controlados solo como bootstrap de UI, sin convertir eso en runtime final.

Out of scope:
- Persistencia real con Prisma y Azure SQL.
- Auth.js, tenant real desde sesión y RBAC efectivo.
- Configuración profunda por campaña.
- Importación de activos, captura móvil, conciliación y exportaciones.
- Worker y jobs asincrónicos.

## Capabilities

### New Capabilities
- `campaigns-list-page`: vista de listado de campañas con resumen operativo.
- `campaign-create-flow`: flujo inicial para crear campañas desde la UI.
- `campaign-detail-page`: detalle base de una campaña con estado y contexto.
- `campaign-lifecycle-foundation`: reglas iniciales del ciclo `draft`, `active`, `closed`.

## Approach
Implementar `campaigns` como el primer dominio visible del producto, manteniendo `app/` para rutas y composición, y llevando tipos, mocks, mapeos de estado y utilidades del slice a una estructura de dominio explícita. La UI debe apoyarse en los componentes shared ya construidos, pero el comportamiento y el lenguaje deben quedar definidos por el dominio `campaigns`, no por la capa shared.
