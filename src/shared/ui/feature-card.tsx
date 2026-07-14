import type { ReactNode } from "react";

import { Panel } from "@/src/shared/ui/panel";

export type FeatureCardProps = {
  title: string;
  description: string;
  eyebrow?: string;
  footer?: ReactNode;
  visual?: ReactNode;
};

export function FeatureCard({
  title,
  description,
  eyebrow,
  footer,
  visual,
}: FeatureCardProps) {
  return (
    <Panel className="flex h-full flex-col justify-between gap-8" glow>
      <div className="space-y-4">
        {eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300/72">
            {eyebrow}
          </span>
        ) : null}
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
            {title}
          </h3>
          <p className="text-sm leading-7 text-white/62">{description}</p>
        </div>
      </div>
      {visual ? <div>{visual}</div> : null}
      {footer ? (
        <div className="border-t border-white/8 pt-4 text-sm text-white/52">
          {footer}
        </div>
      ) : null}
    </Panel>
  );
}
