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
          className="flex items-center justify-center rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-4 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#667085]"
        >
          {item}
        </div>
      ))}
    </Panel>
  );
}
