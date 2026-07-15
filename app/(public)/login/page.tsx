import { redirect } from "next/navigation";

import { getAuthSession } from "@/src/features/auth/session";
import { LoginForm } from "@/src/features/auth/login-form";
import { landingNavItems } from "@/src/shared/content/showcase";
import { Panel } from "@/src/shared/ui/panel";
import { TopNav } from "@/src/shared/ui/top-nav";

export default async function LoginPage() {
  const session = await getAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <TopNav
        brand="AssetLens"
        ctaHref="/"
        ctaLabel="Volver al inicio"
        items={landingNavItems}
      />

      <section className="grid min-h-[78vh] items-center gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/72">
            Acceso a la plataforma
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-[-0.07em] text-white sm:text-7xl">
              Ingrese para administrar campañas, capturas y revisión de inventario.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              Acceda al panel principal para revisar el avance de los conteos,
              configurar campañas y continuar el trabajo del equipo en terreno.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Panel padding="sm">
              <p className="text-sm text-white/50">Campañas</p>
              <p className="mt-2 text-xl font-semibold text-white">Control central</p>
            </Panel>
            <Panel padding="sm">
              <p className="text-sm text-white/50">Sesión</p>
              <p className="mt-2 text-xl font-semibold text-white">Acceso protegido</p>
            </Panel>
            <Panel padding="sm">
              <p className="text-sm text-white/50">Integración</p>
              <p className="mt-2 text-xl font-semibold text-white">
                Entra ID
              </p>
            </Panel>
          </div>
        </div>

        <div className="flex justify-center xl:justify-end">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
