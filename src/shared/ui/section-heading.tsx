import type { ReactNode } from "react";

import { cn } from "@/src/shared/lib/cn";

export type SectionHeadingProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  align?: "left" | "center";
  eyebrow?: string;
};

export function SectionHeading({
  title,
  description,
  actions,
  align = "left",
  eyebrow,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
      )}
    >
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/72">
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-3">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}
