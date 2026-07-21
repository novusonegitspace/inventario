import type { ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  LogOut,
  Menu,
} from "lucide-react";

import { logout } from "@/src/features/auth/actions";
import { BrandLogo } from "@/src/shared/ui/brand-logo";
import { MvpShellNav } from "@/src/shared/ui/mvp-shell-nav";

function getInitials(name: string) {
  const tokens = name.trim().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return "AL";
  }

  return tokens
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");
}

function getRoleLabel(role: string) {
  if (role === "tenant_admin") {
    return "Administrador";
  }

  if (role === "project_lead") {
    return "Líder de proyecto";
  }

  if (role === "supervisor") {
    return "Supervisor";
  }

  if (role === "client") {
    return "Cliente";
  }

  return "Auditor";
}

export function MvpShell({
  children,
  sessionName,
  sessionRole,
}: {
  children: ReactNode;
  sessionName: string;
  sessionRole: string;
}) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#2d2d2d]">
      <header className="sticky top-0 z-40 border-b border-[#e4e7eb] bg-white/95 backdrop-blur">
        <div className="mx-auto grid w-full max-w-none grid-cols-1 gap-3 px-4 py-3 sm:px-6 min-[1700px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[1700px]:items-center min-[1700px]:gap-5 min-[1700px]:px-8">
          <div className="flex min-w-0 items-center justify-between gap-4 min-[1700px]:justify-start">
            <BrandLogo
              className="h-[82px] w-[300px] rounded-[22px] sm:h-[92px] sm:w-[340px]"
              imageClassName="object-contain"
            />

            <details className="relative block min-[1700px]:hidden">
              <summary className="grid h-12 w-12 cursor-pointer list-none place-items-center rounded-full border border-[#dde3ef] bg-[#f8fafc] text-[#14375a] transition hover:border-[#c8d5eb] [&::-webkit-details-marker]:hidden">
                <span className="sr-only">Abrir navegación</span>
                <Menu aria-hidden="true" className="h-[1.35rem] w-[1.35rem]" strokeWidth={2.2} />
              </summary>
              <div className="fixed inset-x-4 top-[6.5rem] z-50 max-h-[calc(100vh-7.5rem)] overflow-y-auto rounded-2xl border border-[#d8e0ec] bg-white p-2 shadow-[0_26px_64px_rgba(20,55,90,0.18)]">
                <MvpShellNav variant="mobile" />
                <div className="mt-2 border-t border-[#e4e7eb] pt-2">
                  <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#14375a] to-[#16b8ac] text-sm font-semibold text-white">
                      {getInitials(sessionName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-[#14375a]">{sessionName}</p>
                      <p className="text-sm text-[#667085]">{getRoleLabel(sessionRole)}</p>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 px-2">
                    <button
                      type="button"
                      className="relative grid h-11 w-11 place-items-center rounded-full border border-[#e4e7eb] text-[#667085] transition hover:text-[#14375a]"
                      aria-label="Notificaciones"
                    >
                      <Bell aria-hidden="true" className="h-[1.35rem] w-[1.35rem]" strokeWidth={2.2} />
                      <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#16b8ac]" />
                    </button>
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center rounded-full border border-[#e4e7eb] text-[#667085] transition hover:text-[#14375a]"
                      aria-label="Ayuda"
                    >
                      <CircleHelp aria-hidden="true" className="h-[1.35rem] w-[1.35rem]" strokeWidth={2.2} />
                    </button>
                    <form action={logout} className="min-w-0 flex-1">
                      <button className="flex h-11 w-full items-center justify-between rounded-full border border-[#e4e7eb] px-4 text-left text-base font-semibold text-[#14375a] transition hover:bg-[#f7f8fa]">
                        <span>Salir</span>
                        <LogOut aria-hidden="true" className="h-[1.2rem] w-[1.2rem] text-[#98a2b3]" strokeWidth={2.2} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <div className="hidden min-w-0 min-[1700px]:block">
            <MvpShellNav />
          </div>

          <div className="hidden min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3 min-[1700px]:flex">
            <button
              type="button"
              className="relative inline-flex h-11 w-11 items-center justify-center text-[#667085] transition hover:text-[#14375a]"
              aria-label="Notificaciones"
            >
              <Bell aria-hidden="true" className="h-[1.5rem] w-[1.5rem]" strokeWidth={2.2} />
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-[#16b8ac]" />
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-[#667085] transition hover:text-[#14375a]"
              aria-label="Ayuda"
            >
              <CircleHelp aria-hidden="true" className="h-[1.5rem] w-[1.5rem]" strokeWidth={2.2} />
            </button>
            <details className="group relative">
              <summary className="flex list-none cursor-pointer items-center gap-3 rounded-full border border-[#e4e7eb] bg-[#f8fafc] px-4 py-2.5 transition hover:border-[#d0d5dd] [&::-webkit-details-marker]:hidden">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#14375a] to-[#16b8ac] text-sm font-semibold text-white">
                  {getInitials(sessionName)}
                </div>
                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-sm font-semibold text-[#14375a]">{sessionName}</p>
                  <p className="text-sm text-[#667085]">{getRoleLabel(sessionRole)}</p>
                </div>
                <span className="text-[#667085] transition group-open:rotate-180">
                  <ChevronDown aria-hidden="true" className="h-[1.25rem] w-[1.25rem]" strokeWidth={2.4} />
                </span>
              </summary>
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-[220px] rounded-2xl border border-[#e4e7eb] bg-white p-2 shadow-[0_22px_60px_rgba(20,55,90,0.14)]">
                <div className="rounded-xl px-3 py-2">
                  <p className="text-sm font-semibold text-[#14375a]">{sessionName}</p>
                  <p className="text-sm text-[#667085]">{getRoleLabel(sessionRole)}</p>
                </div>
                <div className="my-1 h-px bg-[#e4e7eb]" />
                <form action={logout}>
                  <button className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#14375a] transition hover:bg-[#f7f8fa]">
                    <span>Salir</span>
                    <LogOut aria-hidden="true" className="h-[1.05rem] w-[1.05rem] text-[#98a2b3]" strokeWidth={2.2} />
                  </button>
                </form>
              </div>
            </details>
          </div>
        </div>
      </header>

      <div className="mx-auto min-w-0 max-w-[1800px] px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </div>
    </div>
  );
}
