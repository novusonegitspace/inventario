import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@/src/shared/lib/cn";
import { BrandLogo } from "@/src/shared/ui/brand-logo";
import { Button } from "@/src/shared/ui/button";

export type TopNavItem = {
  href: string;
  label: string;
};

export type TopNavProps = {
  activeHref?: string;
  brand: string;
  ctaHref?: string;
  ctaLabel?: string;
  items: TopNavItem[];
};

export function TopNav({
  activeHref,
  brand,
  ctaHref,
  ctaLabel,
  items,
}: TopNavProps) {
  return (
    <nav className="rounded-full border border-[#d8e0ec] bg-white/95 px-4 py-3 shadow-[0_20px_48px_rgba(20,55,90,0.10)] backdrop-blur-lg sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <BrandLogo
          alt={brand}
          className="h-[76px] w-[282px] rounded-[18px] md:h-[86px] md:w-[326px]"
          imageClassName="object-contain"
        />

        <div className="hidden min-w-0 items-center gap-5 md:flex lg:gap-7">
          {items.map((item) => (
            <Link
              key={item.href}
              className={cn(
                "text-[1rem] font-medium text-[#24354e] transition hover:text-[#14375a]",
                item.href === activeHref && "text-[#16b8ac]",
              )}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          {ctaHref && ctaLabel ? (
            <Button href={ctaHref} size="md">
              {ctaLabel}
            </Button>
          ) : null}
        </div>

        <details className="relative block md:hidden">
          <summary className="grid h-12 w-12 cursor-pointer list-none place-items-center rounded-full border border-[#dde3ef] bg-[#f8fafc] text-[#14375a] transition hover:border-[#c8d5eb] [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Abrir menú</span>
            <Menu aria-hidden="true" className="h-6 w-6" strokeWidth={2.2} />
          </summary>
          <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-[#d8e0ec] bg-white p-2 shadow-[0_26px_64px_rgba(20,55,90,0.18)]">
            <div className="grid gap-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-[1rem] font-medium transition",
                    item.href === activeHref
                      ? "bg-[#f0fdf4] text-[#16b8ac]"
                      : "text-[#24354e] hover:bg-[#f5f7fb]",
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {ctaHref && ctaLabel ? (
              <Button href={ctaHref} size="md" className="mt-2 w-full justify-center">
                {ctaLabel}
              </Button>
            ) : null}
          </div>
        </details>
      </div>
    </nav>
  );
}
