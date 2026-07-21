"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderOpen,
  GitCompareArrows,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/src/shared/lib/cn";

const items: Array<{
  href: string;
  label: string;
  Icon: LucideIcon;
  match: (pathname: string) => boolean;
}> = [
  {
    href: "/dashboard",
    label: "Dashboard",
    Icon: LayoutDashboard,
    match: (pathname) => pathname.startsWith("/dashboard"),
  },
  {
    href: "/campaigns",
    label: "Campañas",
    Icon: FolderOpen,
    match: (pathname) => pathname.startsWith("/campaigns"),
  },
  {
    href: "/assets",
    label: "Activos",
    Icon: Package,
    match: (pathname) => pathname.startsWith("/assets"),
  },
  {
    href: "/reconciliation",
    label: "Conciliación",
    Icon: GitCompareArrows,
    match: (pathname) => pathname.startsWith("/reconciliation"),
  },
  {
    href: "/findings",
    label: "Hallazgos",
    Icon: TriangleAlert,
    match: (pathname) => pathname.startsWith("/findings"),
  },
  {
    href: "/reports",
    label: "Reportes",
    Icon: FileText,
    match: (pathname) => pathname.startsWith("/reports"),
  },
  {
    href: "/audit",
    label: "Auditoría",
    Icon: ShieldCheck,
    match: (pathname) => pathname.startsWith("/audit"),
  },
  {
    href: "/admin",
    label: "Administración",
    Icon: Settings,
    match: (pathname) => pathname.startsWith("/admin"),
  },
] as const;

export function MvpShellNav({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const isMobile = variant === "mobile";

  return (
    <nav
      aria-label="Principal"
      className={cn(
        "no-scrollbar",
        isMobile
          ? "grid gap-1"
          : "flex min-w-0 items-center justify-center gap-0.5 overflow-visible",
      )}
    >
      {items.map((item) => {
        const active = item.match(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2.5 text-sm font-semibold transition",
              isMobile
                ? "rounded-xl px-3.5 py-3 text-[1rem]"
                : "relative rounded-t-xl px-2.5 py-4 text-[0.95rem] 2xl:px-3.5 2xl:text-[1rem]",
              active
                ? "text-[#16b8ac]"
                : "text-[#42526b] hover:text-[#14375a]",
            )}
          >
            <item.Icon
              aria-hidden="true"
              className="h-[1.4rem] w-[1.4rem] shrink-0"
              strokeWidth={2.2}
            />
            <span>{item.label}</span>
            {!isMobile ? (
              <span
                className={cn(
                  "absolute inset-x-3 bottom-0 h-[3px] rounded-full transition sm:inset-x-4",
                  active ? "bg-[#16b8ac]" : "bg-transparent",
                )}
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
