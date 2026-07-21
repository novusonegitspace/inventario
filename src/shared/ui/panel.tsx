import type { HTMLAttributes } from "react";

import { cn } from "@/src/shared/lib/cn";

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
  padding?: keyof typeof paddingClasses;
};

export function Panel({
  children,
  className,
  glow = false,
  padding = "md",
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[#e4e7eb] bg-white",
        "shadow-[0_18px_48px_rgba(20,55,90,0.08)]",
        glow && "shadow-[0_18px_48px_rgba(20,55,90,0.10)]",
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
