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
        "rounded-[28px] border border-white/10 bg-slate-950/72 backdrop-blur-xl",
        "shadow-[0_24px_80px_rgba(3,7,18,0.45)]",
        glow && "shadow-[0_24px_80px_rgba(74,222,128,0.12)]",
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
