import Link from "next/link";

import { cn } from "@/src/shared/lib/cn";
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
    <nav className="flex items-center justify-between gap-6 rounded-full border border-white/10 bg-slate-950/76 px-4 py-3 backdrop-blur-xl sm:px-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-emerald-300 uppercase"
        href="/"
      >
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(74,222,128,0.8)]" />
        {brand}
      </Link>
      <div className="hidden items-center gap-6 md:flex">
        {items.map((item) => (
          <Link
            key={item.href}
            className={cn(
              "text-sm font-medium text-white/58 transition hover:text-white",
              item.href === activeHref && "text-white",
            )}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
      {ctaHref && ctaLabel ? (
        <Button href={ctaHref} size="sm">
          {ctaLabel}
        </Button>
      ) : null}
    </nav>
  );
}
