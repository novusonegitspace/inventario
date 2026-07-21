import Link from "next/link";
import type { ReactNode } from "react";

export function MvpTopbar({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#667085]">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#2d2d2d] sm:text-4xl">
          {title}
        </h1>
      </div>
      {action}
    </header>
  );
}

export function MvpPrimaryLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#14375a] px-4 text-sm font-semibold text-white transition hover:bg-[#102e4d]"
    >
      {children}
    </Link>
  );
}

export function MvpSecondaryLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#e4e7eb] bg-white px-4 text-sm font-semibold text-[#14375a] transition hover:bg-[#f7f8fa]"
    >
      {children}
    </Link>
  );
}
