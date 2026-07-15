import { cn } from "@/src/shared/lib/cn";

export function CampaignProgressMeter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-white/52">Avance operativo</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/8">
        <div
          className="h-2 rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(74,222,128,0.4)] transition-[width]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
