import { cn } from "@/src/shared/lib/cn";

const toneClasses = {
  emerald:
    "border border-[#b7ece5] bg-[#e9fbf7] text-[#0f988c]",
  slate: "border border-[#d8e2ee] bg-[#eef5fb] text-[#14375a]",
  outline: "border border-[#d0d5dd] bg-white text-[#667085]",
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
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
