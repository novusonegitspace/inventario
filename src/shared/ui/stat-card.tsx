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
    <Panel className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-white/52">{title}</p>
        <div className="space-y-2">
          <p className="text-4xl font-semibold tracking-[-0.05em] text-white">
            {value}
          </p>
          <p className="text-sm leading-7 text-white/60">{summary}</p>
        </div>
      </div>
      {visual ? <div>{visual}</div> : null}
      {trend ? (
        <div className="inline-flex w-fit rounded-full border border-emerald-400/24 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
          {trend}
        </div>
      ) : null}
    </Panel>
  );
}
