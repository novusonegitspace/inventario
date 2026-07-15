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
        eyebrow="Recorrido visual"
        title="Así se verá la experiencia de AssetLens en sus principales pantallas"
        description="Explore la estética de navegación, métricas, seguimiento y control que acompañará campañas, captura móvil y revisión operativa."
        actions={
          <>
            <Button href="/" variant="secondary">
              Ver portada
            </Button>
            <Button href="#catalogo">Ver recorrido</Button>
          </>
        }
      />

      <section id="catalogo" className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel glow padding="lg">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-300/72">
                Navegación principal
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white">
                Accesos rápidos para entrar, revisar y continuar la operación
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/">Ir al inicio</Button>
              <Button variant="ghost">Acción secundaria</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge>Operación activa</Badge>
              <Badge tone="slate">Seguimiento</Badge>
              <Badge tone="outline">Solo lectura</Badge>
            </div>
            <LogoStrip items={logoItems.slice(0, 5)} />
          </div>
        </Panel>

        <FeatureCard
          eyebrow="Pantallas"
          title="Tarjetas y paneles pensados para información operativa"
          description="La interfaz prioriza lectura rápida de campañas, alertas y métricas, con suficiente contraste para jornadas largas de supervisión."
          footer="Una base visual consistente ayuda a que el equipo identifique estados y acciones sin fricción."
          visual={
            <div className="grid gap-4 sm:grid-cols-2">
              <Panel padding="sm">
                <p className="text-sm text-white/52">Vista resumida</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Información compacta
                </p>
              </Panel>
              <Panel glow>
                <p className="text-sm text-white/52">Elemento destacado</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Atención inmediata
                </p>
              </Panel>
            </div>
          }
        />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Seguimiento"
          title="Métricas pensadas para supervisar inventarios en curso"
          description="Estos bloques muestran avance, asignaciones y desempeño para que la coordinación del inventario sea clara en cada etapa."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <StatCard
            title="Ritmo de captura"
            value="78%"
            summary="Visualiza la intensidad de trabajo del equipo durante la jornada y ayuda a detectar pausas o zonas de menor avance."
            trend="Seguimiento"
            visual={<SignalBars values={chartValues} />}
          />
          <StatCard
            title="Equipo asignado"
            value="4"
            summary="Identifica rápidamente quiénes participan en la campaña y facilita la coordinación entre supervisión y terreno."
            trend="Cuadrilla"
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
          eyebrow="Orientación"
          title="Encabezados claros para cada etapa de la operación"
          description="Cada bloque ayuda al usuario a entender qué está viendo, qué puede hacer y qué impacto tiene en el avance del inventario."
          footer="La claridad en los encabezados reduce dudas y acelera la ejecución diaria."
        />
        <FeatureCard
          eyebrow="Navegación"
          title="Una barra superior pensada para entrar y moverse rápido"
          description="La navegación mantiene a mano las acciones principales para que el usuario pase del inicio a campañas, seguimiento y control sin perder contexto."
          footer="El objetivo es que la operación fluya con pocos clics y rutas claras."
        />
      </section>
    </main>
  );
}
