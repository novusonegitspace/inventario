import type { TopNavItem } from "@/src/shared/ui/top-nav";

export const landingNavItems: TopNavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "#escaneo", label: "Escaneo" },
  { href: "#flujo", label: "Flujo" },
  { href: "#control", label: "Control" },
];

export const navItems: TopNavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/visualizacion", label: "Visualización" },
  { href: "#modulos", label: "Módulos" },
  { href: "#metricas", label: "Métricas" },
];

export const logoItems = [
  "Novus One",
  "Asset Ops",
  "Audit Flow",
  "Field Sync",
  "Control Hub",
];

export const chartValues = [38, 56, 44, 72, 48, 90, 66, 58, 84, 63, 78, 92];

export const dashboardCards = [
  { label: "Campañas activas", value: "12", width: "w-24" },
  { label: "Auditores", value: "48", width: "w-20" },
  { label: "Diferencias", value: "31", width: "w-16" },
];

export const heroMetrics = [
  { label: "Activos procesados", value: "128k" },
  { label: "Escaneo por móvil", value: "100%" },
  { label: "Trazabilidad", value: "Full" },
];

export const mobileScanHighlights = [
  {
    eyebrow: "Escaneo con cámara",
    title: "Captura códigos de barras con el propio celular del auditor",
    description:
      "Sin pistolas de escaneo ni hardware adicional. El flujo móvil usa la cámara del teléfono para registrar activos en terreno con rapidez.",
    footer: "Menos fricción operativa y despliegue más rápido por campaña.",
  },
  {
    eyebrow: "Evidencia conectada",
    title: "Cada lectura puede llevar foto, ubicación y observaciones",
    description:
      "La captura no termina en el código: se complementa con evidencia visual, metadata y contexto para auditoría y conciliación posterior.",
    footer: "Pensado para operaciones físicas, no para demos aisladas.",
  },
];

export const inventoryFlow = [
  {
    step: "01",
    title: "Preparar campaña",
    summary:
      "Define alcance, auditores, criterios y maestro de activos por cliente o sede.",
  },
  {
    step: "02",
    title: "Escanear en terreno",
    summary:
      "El auditor usa su propio celular para leer el código y registrar evidencia en el momento.",
  },
  {
    step: "03",
    title: "Conciliar diferencias",
    summary:
      "El sistema contrasta maestro y captura para detectar faltantes, sobrantes o inconsistencias.",
  },
  {
    step: "04",
    title: "Cerrar y reportar",
    summary:
      "Genera resultados, exportaciones y trazabilidad lista para revisión interna o del cliente.",
  },
];

export const controlStats = [
  {
    title: "Tiempo de lectura",
    value: "2.3s",
    summary:
      "Tiempo objetivo por captura cuando el flujo móvil está optimizado y el código es legible.",
    trend: "Captura ágil",
  },
  {
    title: "Cobertura de evidencia",
    value: "99%",
    summary:
      "Cada activo puede quedar respaldado con foto, ubicación, observaciones y huella de archivo.",
    trend: "Auditable",
  },
  {
    title: "Conciliación operativa",
    value: "24/7",
    summary:
      "El equipo de control puede revisar diferencias y avances sin esperar cierres manuales por lote.",
    trend: "Tiempo real",
  },
];

export const sharedModules = [
  {
    eyebrow: "Escalabilidad",
    title: "Base visual consistente para campañas, reportes y captura móvil",
    description:
      "Los componentes compartidos reducen variaciones entre módulos y mantienen una sola semántica para acciones, estados y superficies.",
    footer: "Ideal para Dashboard, Campañas, Reportes, Auditoría y Administración.",
  },
  {
    eyebrow: "Dominio",
    title: "Screaming architecture sin esconder el negocio detrás de carpetas genéricas",
    description:
      "Las rutas y módulos de producto crecerán por capacidad de negocio; la capa shared queda reservada para piezas realmente transversales.",
    footer: "La UI compartida no reemplaza el diseño por dominio; solo evita duplicación.",
  },
];

export const statCards = [
  {
    title: "Costo por despliegue",
    value: "-18%",
    summary:
      "Menos retrabajo visual al reutilizar botones, paneles, tarjetas y patrones de navegación.",
    trend: "Optimizado",
  },
  {
    title: "Cobertura visual",
    value: "90%",
    summary:
      "Las pantallas nuevas arrancan con piezas ya tipadas y consistentes en vez de HTML ad hoc.",
    trend: "Base común",
  },
  {
    title: "Lectura operativa",
    value: "24/7",
    summary:
      "Cards de métricas y estados pensados para escritorio operativo y uso móvil en terreno.",
    trend: "P0 listo",
  },
];

export const auditors = [
  "María Soto",
  "Carlos Díaz",
  "Inés Vega",
  "Tomás León",
];
