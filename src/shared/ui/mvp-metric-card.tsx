import type { ReactNode } from "react";

export function MvpMetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: ReactNode;
}) {
  return (
    <div className="grid min-h-[118px] content-between rounded-lg border border-[#e4e7eb] bg-white p-5 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
      <div className="text-sm text-[#1f9e7a]">{accent}</div>
      <div className="space-y-1">
        <p className="text-3xl font-semibold tracking-[-0.04em] text-[#14375a]">
          {value}
        </p>
        <p className="text-sm text-[#667085]">{label}</p>
      </div>
    </div>
  );
}
