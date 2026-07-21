# Proposal: Physical Capture Configuration v2

## Intent
Implementar correctamente las pantallas de configuración de toma física del PDD dentro del workspace de campaña, con persistencia real, UX optimizada para celular y reglas de captura que luego gobiernen activos, captura móvil, evidencias y conciliación.

Estas pantallas no deben vivir como parte pesada del formulario inicial de creación. El flujo correcto es:

1. `/campaigns/new`: crear campaña en estado `draft` con datos mínimos.
2. `/campaigns/[campaignId]/settings`: configurar toma física, tipo de inventario, método de gestión de activos, campos, evidencia y reglas.
3. `/campaigns/[campaignId]/assets`: cargar maestro o administrar activos según la configuración.
4. `/campaigns/[campaignId]/capture` o rutas de captura contextual: aplicar dinámicamente la configuración guardada.

## Why Now
El producto necesita decidir con precisión cómo se tomará el inventario antes de abrir captura en terreno. Hoy existen campos básicos en `CampaignSettings`, pero no alcanzan para representar las pantallas del PDD:

- `Conteo simple`
- `Auditoría completa`
- `Personalizado`
- carga masiva de maestro
- registro manual o híbrido
- campos obligatorios/opcionales/no aplican
- evidencia obligatoria/adicional
- activos sobrantes
- campos personalizados
- revisión y confirmación

Si estas reglas no quedan persistidas como contrato de campaña, el flujo móvil y la conciliación terminarán usando supuestos hardcodeados.

## Scope
In scope:
- Definir la ubicación final de las pantallas de configuración de toma física.
- Rediseñar `/campaigns/new` como creación ligera de campaña.
- Implementar `/campaigns/[campaignId]/settings` como pantalla principal de configuración de toma física.
- Persistir tipos de inventario, método de gestión de activos, reglas de evidencia, campos y opciones de captura.
- Implementar modal de carga de maestro con validación previa.
- Implementar modal de campo personalizado.
- Aplicar diseño responsive mobile-first.
- Preparar el contrato para que captura móvil lea la configuración guardada.

Out of scope:
- Parser final Excel/CSV con carga productiva completa si no existe almacenamiento definido.
- Sincronización offline real.
- MSAL/Entra ID.
- Exportaciones finales PDF/Excel.
- Conciliación completa basada en reglas nuevas.

## Product Placement
La pantalla del mockup debe implementarse como:

```text
/campaigns/[campaignId]/settings
```

Nombre visible:

```text
Configuración de toma física
```

Justificación:
- Es configuración propia de una campaña ya creada.
- Puede modificarse antes y durante la campaña.
- Debe controlar módulos posteriores: activos, captura, evidencias y conciliación.
- No debe bloquear el alta inicial de campaña con demasiada complejidad.

## Capabilities

### New Capabilities
- `physical-capture-settings-page`
- `inventory-mode-presets`
- `asset-management-method-settings`
- `master-upload-validation-modal`
- `capture-field-configuration`
- `evidence-rules-configuration`
- `surplus-asset-rules`
- `custom-field-modal`
- `campaign-settings-mobile-ux`

### Changed Capabilities
- `campaign-create-flow`
- `campaign-settings-domain`
- `mobile-capture-flow`
- `campaign-assets-management`

## Success Criteria
- Crear campaña no requiere configurar todos los campos de captura.
- Al entrar a configuración se muestran presets por modo.
- Cada modo aplica defaults claros y editables.
- La configuración queda persistida en Prisma/Azure SQL.
- El diseño funciona en desktop y celular sin tablas imposibles de usar.
- Guardar configuración deja un contrato consumible por captura móvil.
- La carga de maestro valida estructura antes de confirmar.
