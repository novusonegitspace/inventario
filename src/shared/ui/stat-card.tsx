import type { ReactNode } from "react";

import { Panel } from "@/src/shared/ui/panel";

export type StatCardProps = {
  title: string;
  value: string;
  summary: string;
  trend?: string;
  visual?: ReactNode;
};

export function StatCard({
  title,
  value,
  summary,
  trend,
  visual,
}: StatCardProps) {
  return (
    <Panel className="flex h-full min-h-[132px] flex-col justify-between gap-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-[#667085]">{title}</p>
        <div className="space-y-2">
          <p className="text-4xl font-semibold tracking-[-0.05em] text-[#14375a]">
            {value}
          </p>
          <p className="text-sm leading-7 text-[#667085]">{summary}</p>
        </div>
      </div>
      {visual ? <div>{visual}</div> : null}
      {trend ? (
        <div className="inline-flex w-fit rounded-full border border-[#b7ece5] bg-[#e9fbf7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f988c]">
          {trend}
        </div>
      ) : null}
    </Panel>
  );
}
