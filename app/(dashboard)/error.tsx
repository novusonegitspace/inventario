"use client";

import Link from "next/link";
import { useEffect } from "react";

function isDatabaseError(message: string) {
  return (
    message.includes("Can't reach database server") ||
    message.includes("Missing DATABASE_URL") ||
    message.includes("No se pudo conectar con la base de datos")
  );
}

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const databaseError = isDatabaseError(error.message);

  return (
    <main className="space-y-6">
      <section className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#667085]">
          Incidencia operativa
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#2d2d2d]">
          {databaseError
            ? "La aplicación no pudo abrir la base de datos"
            : "No pudimos completar esta operación"}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#667085]">
          {databaseError
            ? "El entorno actual intenta conectarse a SQL Server y no encontró un servidor disponible. Revise la conexión local o la variable DATABASE_URL antes de continuar."
            : "Recargue la vista o vuelva a intentarlo. Si el problema persiste, revise el servicio de base de datos y la configuración del entorno."}
        </p>

        {databaseError ? (
          <div className="mt-6 rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-5 text-sm leading-7 text-[#667085]">
            <p className="font-semibold text-[#14375a]">Qué revisar ahora</p>
            <p className="mt-3">
              Si está trabajando localmente con Docker, levante SQL Server con
              <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-[#14375a]">
                npm run db:up
              </code>
              dentro de
              <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-[#14375a]">
                inventarionovusone
              </code>
              .
            </p>
            <p className="mt-3">
              Si quiere usar Azure, actualice
              <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-[#14375a]">
                DATABASE_URL
              </code>
              en su
              <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-[#14375a]">
                .env
              </code>
              con el servidor SQL remoto correcto.
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#14375a] px-4 text-sm font-semibold text-white transition hover:bg-[#102e4d]"
            onClick={() => reset()}
            type="button"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#e4e7eb] bg-white px-4 text-sm font-semibold text-[#14375a] transition hover:bg-[#f7f8fa]"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
