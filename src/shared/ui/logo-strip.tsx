import { Panel } from "@/src/shared/ui/panel";

export type LogoStripProps = {
  items: string[];
};

export function LogoStrip({ items }: LogoStripProps) {
  return (
    <Panel className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" padding="sm">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center justify-center rounded-2xl border border-white/8 bg-white/4 px-4 py-5 text-sm font-semibold uppercase tracking-[0.22em] text-white/52"
        >
          {item}
        </div>
      ))}
    </Panel>
  );
}
