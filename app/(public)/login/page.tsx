import Image from "next/image";
import { redirect } from "next/navigation";
import { Cloud, ShieldCheck, Smartphone } from "lucide-react";

import { getAuthSession } from "@/src/features/auth/session";
import { LoginForm } from "@/src/features/auth/login-form";

const loginHighlights = [
  {
    icon: Smartphone,
    title: "Desde tu celular",
    description:
      "Escanea, captura evidencia y registra información en segundos.",
  },
  {
    icon: ShieldCheck,
    title: "Trazabilidad completa",
    description:
      "Cada acción queda registrada con fecha, usuario y ubicación.",
  },
  {
    icon: Cloud,
    title: "Seguro y confiable",
    description:
      "Tu información protegida en la nube de Microsoft Azure.",
  },
];

export default async function LoginPage() {
  const session = await getAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-[#f4f7fb] px-4 py-8 text-[#14375a] sm:px-6 lg:px-10">
      <section className="grid w-full max-w-[1520px] overflow-hidden rounded-[28px] border border-[#e4e7eb] bg-white shadow-[0_30px_90px_rgba(20,55,90,0.14)] lg:min-h-[760px] lg:grid-cols-[39rem_minmax(0,1fr)]">
        <div className="flex flex-col items-center justify-center px-8 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-[29rem] text-center">
            <div className="mx-auto h-[12rem] w-full max-w-[22rem]">
              <Image
                alt="NovusOne AssetLens"
                className="h-full w-full object-contain"
                height={220}
                priority
                src="/logo.png"
                width={540}
              />
            </div>

            <div className="mx-auto -mt-3 h-1 w-16 rounded-full bg-[#16b8ac]" />

            <p className="mx-auto mt-8 max-w-[25rem] text-2xl leading-9 text-[#667085]">
              Inventario, evidencia y trazabilidad de activos fijos desde el celular.
            </p>

            <div className="mt-14">
              <LoginForm />
            </div>

            <div className="mt-12 flex items-start gap-4 text-left">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#ecfffb] text-[#16b8ac]">
                <ShieldCheck aria-hidden="true" className="h-7 w-7" strokeWidth={2} />
              </div>
              <p className="text-base font-semibold leading-7 text-[#667085]">
                Seguridad empresarial con Microsoft Entra ID MFA y acceso
                condicionado habilitados.
              </p>
            </div>

            <div className="mt-14 h-px bg-[#e4e7eb]" />

            <p className="mt-8 text-sm font-medium text-[#98a2b3]">
              © 2026 NovusOne. Todos los derechos reservados.
            </p>
          </div>
        </div>

        <div className="relative min-h-[42rem] overflow-hidden bg-[#06243a] lg:min-h-full">
          <Image
            alt="Escaneo de activo desde celular"
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            src="/banner.png"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,31,52,0.9)_0%,rgba(2,31,52,0.72)_42%,rgba(2,31,52,0.28)_100%)]" />

          <div className="absolute inset-y-0 left-0 z-10 flex w-full max-w-[42rem] flex-col justify-center gap-12 px-8 py-12 sm:px-14 lg:px-16">
            {loginHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div className="flex items-center gap-7" key={item.title}>
                  <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border border-[#16b8ac] bg-[#06243a]/58 text-white shadow-[0_0_0_18px_rgba(22,184,172,0.08)]">
                    <Icon aria-hidden="true" className="h-11 w-11" strokeWidth={1.9} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white">
                      {item.title}
                    </h2>
                    <p className="max-w-[24rem] text-xl leading-8 text-white/82">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-12 left-14 z-10 hidden grid-cols-6 gap-6 opacity-80 sm:grid">
            {Array.from({ length: 36 }).map((_, index) => (
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#16b8ac]"
                key={index}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
