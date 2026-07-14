import Image from "next/image";

import {
  auditors,
  controlStats,
  chartValues,
  heroMetrics,
  inventoryFlow,
  landingNavItems,
  logoItems,
  mobileScanHighlights,
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

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-12 px-4 py-6 sm:px-6 lg:px-8">
      <TopNav
        activeHref="/"
        brand="AssetLens"
        items={landingNavItems}
      />

      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/72 px-6 py-10 shadow-[0_40px_120px_rgba(6,17,15,0.6)] sm:px-10 sm:py-14 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(97,240,141,0.24),_transparent_70%)]" />
        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-emerald-300/12 blur-3xl" />
        <div className="relative grid items-center gap-10 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col gap-7">
            <Badge>Inventario físico con captura móvil</Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.07em] text-white sm:text-7xl">
                Escanea activos con el propio celular y concilia el inventario
                sin fricción.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
                AssetLens organiza campañas de inventario, captura códigos de
                barras desde el teléfono del auditor, registra evidencia y
                consolida diferencias en una sola operación trazable.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="#escaneo" size="lg">
                Ver escaneo móvil
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge tone="slate">Cámara del celular</Badge>
              <Badge tone="slate">Foto y ubicación</Badge>
              <Badge tone="slate">Conciliación automática</Badge>
            </div>
          </div>

          <Panel className="relative overflow-hidden" glow padding="lg">
            <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_72%)]" />
            <div className="relative flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white/52">
                    Captura en terreno
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
                    Escaneo desde móvil
                  </p>
                </div>
                <Badge>Live capture</Badge>
              </div>
              <div className="grid items-stretch gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="relative mx-auto flex w-full max-w-none items-end justify-center rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top,_rgba(97,240,141,0.16),_transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 min-h-[520px]">
                  <div className="absolute inset-10 rounded-full bg-emerald-300/18 blur-3xl" />
                  <div className="scan-device relative w-full max-w-[440px] rounded-[34px] border border-white/8 bg-white/4 p-3">
                    <Image
                      alt="Escaneo de código de barras desde el celular"
                      className="h-auto w-full rounded-[28px] object-contain"
                      height={1024}
                      priority
                      src="/celphone-scam.png"
                      width={1024}
                    />
                    <div className="scan-frame pointer-events-none absolute inset-[12%_15%_24%_15%] rounded-[22px] border border-cyan-300/20" />
                    <div className="scan-corner scan-corner-tl pointer-events-none absolute inset-[12%_15%_24%_15%]" />
                    <div className="scan-corner scan-corner-tr pointer-events-none absolute inset-[12%_15%_24%_15%]" />
                    <div className="scan-corner scan-corner-bl pointer-events-none absolute inset-[12%_15%_24%_15%]" />
                    <div className="scan-corner scan-corner-br pointer-events-none absolute inset-[12%_15%_24%_15%]" />
                    <div className="scan-beam pointer-events-none absolute inset-x-[18%] top-[34%] h-[3px] rounded-full" />
                    <div className="scan-beam-glow pointer-events-none absolute inset-x-[18%] top-[34%] h-10 -translate-y-1/2 rounded-full" />
                  </div>
                  <div className="absolute left-4 top-4 rounded-2xl border border-emerald-300/24 bg-slate-950/88 px-4 py-3 shadow-[0_12px_40px_rgba(74,222,128,0.14)] sm:left-6 sm:top-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/72">
                      Verificado
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Activo A-2041 capturado
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-2xl border border-white/10 bg-slate-950/88 px-4 py-3 sm:bottom-6 sm:right-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/48">
                      Tiempo medio
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      2.3 segundos
                    </p>
                  </div>
                </div>
                <div className="grid gap-4">
                  {heroMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-[24px] border border-white/8 bg-white/4 p-5"
                    >
                      <p className="text-sm text-white/48">{metric.label}</p>
                      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                  <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-white/56">
                        Ritmo de operación
                      </p>
                      <Badge tone="slate">En campaña</Badge>
                    </div>
                    <SignalBars values={chartValues.slice(0, 8)} />
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      <LogoStrip items={logoItems} />

      <section id="escaneo" className="space-y-8">
        <SectionHeading
          eyebrow="Escaneo móvil"
          title="La captura ocurre donde está el activo, no detrás de un escritorio"
          description="La experiencia de terreno es parte central del producto. El auditor puede leer el código, adjuntar evidencia y dejar observaciones sin cambiar de dispositivo."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {mobileScanHighlights.map((module) => (
            <FeatureCard
              key={module.title}
              description={module.description}
              eyebrow={module.eyebrow}
              footer={module.footer}
              title={module.title}
              visual={
                <div className="rounded-[24px] border border-emerald-300/16 bg-emerald-400/10 p-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/7 p-4 text-sm text-white/70">
                      Código
                    </div>
                    <div className="rounded-2xl bg-white/7 p-4 text-sm text-white/70">
                      Foto
                    </div>
                    <div className="rounded-2xl bg-white/7 p-4 text-sm text-white/70">
                      GPS
                    </div>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </section>

      <section id="flujo" className="space-y-8">
        <SectionHeading
          eyebrow="Flujo operativo"
          title="Una campaña completa, desde el maestro hasta el reporte final"
          description="La portada tiene que prometer el flujo correcto del producto: preparar, capturar, conciliar y cerrar. No solo mostrar métricas aisladas."
        />
        <div className="grid gap-5 lg:grid-cols-4">
          {inventoryFlow.map((stage) => (
            <Panel key={stage.step} className="flex h-full flex-col gap-6" glow>
              <div className="flex items-center justify-between gap-4">
                <span className="text-4xl font-semibold tracking-[-0.06em] text-white/18">
                  {stage.step}
                </span>
                <Badge tone="outline">Paso</Badge>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                  {stage.title}
                </h3>
                <p className="text-sm leading-7 text-white/60">
                  {stage.summary}
                </p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section id="control" className="space-y-8">
        <SectionHeading
          eyebrow="Control y seguimiento"
          title="La operación no termina al escanear: hay que revisar diferencias y avanzar campañas"
          description="La capa de control reúne conciliación, seguimiento operativo y visibilidad sobre el equipo en campo para que el inventario cierre con evidencia suficiente."
        />
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr_1fr]">
          <FeatureCard
            description="Supervisor y auditores pueden operar la misma campaña con visibilidad compartida sobre ritmo de captura, pendientes y diferencias revisadas."
            eyebrow="Equipo activo"
            footer="Asignación rápida por campaña y trazabilidad por captura."
            title="Coordinación entre terreno y backoffice"
            visual={
              <div className="flex items-center justify-between gap-6 rounded-[24px] border border-white/8 bg-black/24 p-5">
                <div className="space-y-2">
                  <p className="text-sm text-white/52">Cuadrilla principal</p>
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-white">
                    Norte 02
                  </p>
                </div>
                <AvatarStack users={auditors} />
              </div>
            }
          />
          {controlStats.map((card, index) => (
            <StatCard
              key={card.title}
              summary={card.summary}
              title={card.title}
              trend={card.trend}
              value={card.value}
              visual={index === 0 ? <SignalBars values={chartValues} /> : null}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
