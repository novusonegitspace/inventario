import {
  auditors,
  chartValues,
  logoItems,
  navItems,
  statCards,
} from "@/src/shared/content/showcase";
import { AvatarStack } from "@/src/shared/ui/avatar-stack";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { FeatureCard } from "@/src/shared/ui/feature-card";
import { LogoStrip } from "@/src/shared/ui/logo-strip";
import { Panel } from "@/src/shared/ui/panel";
import { SectionHeading } from "@/src/shared/ui/section-heading";
import { SignalBars } from "@/src/shared/ui/signal-bars";
import { StatCard } from "@/src/shared/ui/stat-card";
import { TopNav } from "@/src/shared/ui/top-nav";

export default function VisualizacionPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <TopNav
        activeHref="/visualizacion"
        brand="AssetLens"
        ctaHref="/"
        ctaLabel="Volver al inicio"
        items={navItems}
      />

      <SectionHeading
        align="center"
        eyebrow="Shared UI"
        title="Visualización de componentes compartidos"
        description="Esta página reúne los primeros bloques transversales del producto. La intención es que los futuros dominios compongan sobre estas piezas, no que redefinan sus propias bases visuales."
        actions={
          <>
            <Button href="/" variant="secondary">
              Ver composición
            </Button>
            <Button href="#catalogo">Ir al catálogo</Button>
          </>
        }
      />

      <section id="catalogo" className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel glow padding="lg">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-300/72">
                Navegación y acciones
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white">
                Botones y estados rápidos
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/">Primary</Button>
              <Button href="/visualizacion" variant="secondary">
                Secondary
              </Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge>Badge emerald</Badge>
              <Badge tone="slate">Badge slate</Badge>
              <Badge tone="outline">Badge outline</Badge>
            </div>
            <LogoStrip items={logoItems.slice(0, 5)} />
          </div>
        </Panel>

        <FeatureCard
          eyebrow="Superficies"
          title="Panel y tarjetas como contenedor base"
          description="Usamos superficies oscuras con borde sutil, glow controlado y jerarquía tipográfica fuerte para que campañas, reportes y auditoría compartan el mismo sistema."
          footer="Props principales: padding, glow, visual y footer."
          visual={
            <div className="grid gap-4 sm:grid-cols-2">
              <Panel padding="sm">
                <p className="text-sm text-white/52">Panel sm</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Contenedor compacto
                </p>
              </Panel>
              <Panel glow>
                <p className="text-sm text-white/52">Panel glow</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Contenedor destacado
                </p>
              </Panel>
            </div>
          }
        />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Data"
          title="Bloques para métricas operativas"
          description="La idea no es solo tener una landing bonita. Estos bloques están pensados para representar ratios de conciliación, asignaciones, tendencias y estados de ejecución."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <StatCard
            title="Bar chart"
            value="78%"
            summary="SignalBars acepta un arreglo de porcentajes y se reutiliza en dashboards o vistas de detalle."
            trend="SignalBars"
            visual={<SignalBars values={chartValues} />}
          />
          <StatCard
            title="Avatar stack"
            value="4"
            summary="AvatarStack comunica asignación rápida para auditores, supervisores o responsables."
            trend="AvatarStack"
            visual={<AvatarStack users={auditors} />}
          />
          <StatCard
            title={statCards[2].title}
            value={statCards[2].value}
            summary={statCards[2].summary}
            trend={statCards[2].trend}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <FeatureCard
          eyebrow="SectionHeading"
          title="Encabezado reusable para bloques de producto"
          description="SectionHeading unifica eyebrow, título, descripción y acciones. Con eso evitamos que cada dominio reinvente su propio patrón de introducción."
          footer="Props principales: eyebrow, title, description, align y actions."
        />
        <FeatureCard
          eyebrow="TopNav"
          title="Barra superior lista para áreas públicas o internas"
          description="TopNav acepta marca, items y CTA principal. Más adelante puede recibir estado de sesión o tenant sin cambiar la intención del componente."
          footer="Props principales: brand, items, ctaLabel y ctaHref."
        />
      </section>
    </main>
  );
}
