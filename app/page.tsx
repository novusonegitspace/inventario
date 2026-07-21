import Image from "next/image";

import { getAuthSession } from "@/src/features/auth/session";
import {
  chartValues,
  heroMetrics,
  inventoryFlow,
  landingNavItems,
  mobileScanHighlights,
} from "@/src/shared/content/showcase";
import { MvpMetricCard } from "@/src/shared/ui/mvp-metric-card";
import { MvpSecondaryLink } from "@/src/shared/ui/mvp-topbar";
import { SignalBars } from "@/src/shared/ui/signal-bars";
import { TopNav } from "@/src/shared/ui/top-nav";

export default async function Home() {
  const session = await getAuthSession();
  const dashboardHref = session ? "/dashboard" : "/login";
  const dashboardLabel = session ? "Abrir dashboard" : "Entrar";

  return (
    <main className="min-h-screen bg-[linear-gradient(130deg,#ffffff_0%,#f7f8fa_55%,#dff5ee_100%)]">
      <div className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-12 px-4 py-6 sm:px-6 lg:px-8">
        <TopNav
          activeHref="/"
          brand="AssetLens"
          ctaHref={dashboardHref}
          ctaLabel={dashboardLabel}
          items={landingNavItems}
        />

        <section className="overflow-hidden rounded-[32px] border border-[#e4e7eb] bg-white px-6 py-8 shadow-[0_28px_80px_rgba(20,55,90,0.12)] sm:px-8 sm:py-10 lg:px-10">
          <div className="grid items-center gap-8 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col gap-7">
              <div className="space-y-4">
                <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#eef5fb] px-3 text-xs font-bold uppercase tracking-[0.22em] text-[#14375a]">
                  Inventario físico con captura móvil
                </span>
                <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.07em] text-[#2d2d2d] sm:text-7xl">
                  Escanea activos con el propio celular y concilia el inventario
                  sin fricción.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#667085] sm:text-lg">
                  AssetLens organiza campañas de inventario, captura códigos de
                  barras desde el teléfono del auditor, registra evidencia y
                  consolida diferencias en una sola operación trazable.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={dashboardHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#14375a] px-5 text-sm font-semibold text-white transition hover:bg-[#102e4d]"
                >
                  {session ? "Abrir dashboard" : "Entrar al dashboard"}
                </a>
                <a
                  href="#escaneo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#e4e7eb] bg-white px-5 text-sm font-semibold text-[#14375a] transition hover:bg-[#f7f8fa]"
                >
                  Ver escaneo móvil
                </a>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#eef5fb] px-3 text-xs font-bold text-[#14375a]">
                  Cámara del celular
                </span>
                <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#eef5fb] px-3 text-xs font-bold text-[#14375a]">
                  Foto y ubicación
                </span>
                <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#eef5fb] px-3 text-xs font-bold text-[#14375a]">
                  Conciliación automática
                </span>
              </div>
            </div>

            <div className="relative rounded-[28px] border border-[#e4e7eb] bg-[radial-gradient(circle_at_top,_rgba(31,158,122,0.1),_transparent_52%),linear-gradient(180deg,#fbfcfd_0%,#f7f8fa_100%)] p-5">
              <div className="grid items-stretch gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="relative mx-auto flex min-h-[520px] w-full items-end justify-center rounded-[28px] border border-[#e4e7eb] bg-white p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <div className="absolute inset-10 rounded-full bg-[#1f9e7a]/10 blur-3xl" />
                  <div className="scan-device relative w-full max-w-[440px] rounded-[34px] border border-[#e4e7eb] bg-[#f7f8fa] p-3">
                    <Image
                      alt="Escaneo de código de barras desde el celular"
                      className="h-auto w-full rounded-[28px] object-contain"
                      height={1024}
                      priority
                      src="/celphone-scam.png"
                      width={1024}
                    />
                    <div className="scan-frame pointer-events-none absolute inset-[12%_15%_24%_15%] rounded-[22px] border border-cyan-300/30" />
                    <div className="scan-corner scan-corner-tl pointer-events-none absolute inset-[12%_15%_24%_15%]" />
                    <div className="scan-corner scan-corner-tr pointer-events-none absolute inset-[12%_15%_24%_15%]" />
                    <div className="scan-corner scan-corner-bl pointer-events-none absolute inset-[12%_15%_24%_15%]" />
                    <div className="scan-corner scan-corner-br pointer-events-none absolute inset-[12%_15%_24%_15%]" />
                    <div className="scan-beam pointer-events-none absolute inset-x-[18%] top-[34%] h-[3px] rounded-full" />
                    <div className="scan-beam-glow pointer-events-none absolute inset-x-[18%] top-[34%] h-10 -translate-y-1/2 rounded-full" />
                  </div>
                  <div className="absolute left-4 top-4 rounded-2xl border border-[#b7e7d7] bg-white/96 px-4 py-3 shadow-[0_12px_32px_rgba(31,158,122,0.12)] sm:left-6 sm:top-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#1f9e7a]">
                      Verificado
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#14375a]">
                      Activo A-2041 capturado
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-2xl border border-[#e4e7eb] bg-white/96 px-4 py-3 sm:bottom-6 sm:right-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#667085]">
                      Tiempo medio
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#14375a]">
                      2.3 segundos
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {heroMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-[20px] border border-[#e4e7eb] bg-white p-5 shadow-[0_18px_48px_rgba(20,55,90,0.05)]"
                    >
                      <p className="text-sm text-[#667085]">{metric.label}</p>
                      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#14375a]">
                        {metric.value}
                      </p>
                    </div>
                  ))}

                  <div className="rounded-[20px] border border-[#e4e7eb] bg-white p-5 shadow-[0_18px_48px_rgba(20,55,90,0.05)]">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-[#667085]">
                        Ritmo de operación
                      </p>
                      <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#eef5fb] px-3 text-xs font-bold text-[#14375a]">
                        En campaña
                      </span>
                    </div>
                    <SignalBars values={chartValues.slice(0, 8)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="escaneo" className="grid gap-6 lg:grid-cols-2">
          {mobileScanHighlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#667085]">
                {item.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#2d2d2d]">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#667085]">
                {item.description}
              </p>
              <div className="mt-6 rounded-[20px] border border-[#e4e7eb] bg-[#f7f8fa] p-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 text-sm font-medium text-[#14375a] shadow-[0_10px_24px_rgba(20,55,90,0.05)]">
                    Código
                  </div>
                  <div className="rounded-2xl bg-white p-4 text-sm font-medium text-[#14375a] shadow-[0_10px_24px_rgba(20,55,90,0.05)]">
                    Foto
                  </div>
                  <div className="rounded-2xl bg-white p-4 text-sm font-medium text-[#14375a] shadow-[0_10px_24px_rgba(20,55,90,0.05)]">
                    GPS
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm text-[#667085]">{item.footer}</p>
            </div>
          ))}
        </section>

        <section id="flujo" className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#667085]">
              Flujo operativo
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#2d2d2d]">
              Una campaña completa, desde el maestro hasta el reporte final
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-[#667085]">
              AssetLens acompaña todo el proceso: preparación, captura en terreno,
              conciliación de diferencias y cierre con respaldo documental.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {inventoryFlow.map((stage) => (
              <div
                key={stage.step}
                className="flex h-full flex-col gap-6 rounded-[24px] border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-4xl font-semibold tracking-[-0.06em] text-[#d0d5dd]">
                    {stage.step}
                  </span>
                  <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#eef5fb] px-3 text-xs font-bold text-[#14375a]">
                    Paso
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
                    {stage.title}
                  </h3>
                  <p className="text-sm leading-7 text-[#667085]">
                    {stage.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="control" className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#667085]">
                Control y seguimiento
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#2d2d2d]">
                La operación no termina al escanear
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-8 text-[#667085]">
                La capa de control reúne conciliación, seguimiento operativo y
                visibilidad sobre el equipo en campo para que el inventario cierre
                con evidencia suficiente.
              </p>
            </div>
            <MvpSecondaryLink href={dashboardHref}>
              {session ? "Entrar al panel" : "Ver acceso"}
            </MvpSecondaryLink>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MvpMetricCard label="Campañas activas" value="12" />
            <MvpMetricCard label="Diferencias abiertas" value="31" />
            <MvpMetricCard label="Cobertura de evidencia" value="99%" />
            <MvpMetricCard label="Tiempo de lectura" value="2.3s" />
          </div>
        </section>
      </div>
    </main>
  );
}
