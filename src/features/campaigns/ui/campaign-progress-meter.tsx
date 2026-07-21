import { cn } from "@/src/shared/lib/cn";

export function CampaignProgressMeter({
  value,
  className,
  tone = "dark",
}: {
  value: number;
  className?: string;
  tone?: "dark" | "light";
}) {
  const textClass = tone === "light" ? "text-[#667085]" : "text-white/52";
  const valueClass = tone === "light" ? "text-[#14375a]" : "text-white";
  const trackClass = tone === "light" ? "bg-[#e4e7eb]" : "bg-white/8";
  const barClass =
    tone === "light"
      ? "bg-[#1f9e7a] shadow-[0_0_24px_rgba(31,158,122,0.25)]"
      : "bg-emerald-300 shadow-[0_0_24px_rgba(74,222,128,0.4)]";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className={textClass}>Avance operativo</span>
        <span className={cn("font-semibold", valueClass)}>{value}%</span>
      </div>
      <div className={cn("h-2 rounded-full", trackClass)}>
        <div
          className={cn("h-2 rounded-full transition-[width]", barClass)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
