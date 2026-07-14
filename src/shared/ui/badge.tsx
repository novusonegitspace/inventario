import { cn } from "@/src/shared/lib/cn";

const toneClasses = {
  emerald:
    "border border-emerald-400/30 bg-emerald-400/12 text-emerald-100 shadow-[0_0_30px_rgba(74,222,128,0.12)]",
  slate: "border border-white/10 bg-white/6 text-white/72",
  outline: "border border-white/16 bg-transparent text-white/72",
} as const;

export type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  tone?: keyof typeof toneClasses;
};

export function Badge({
  children,
  className,
  tone = "emerald",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
