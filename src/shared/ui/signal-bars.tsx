export type SignalBarsProps = {
  values: number[];
};

export function SignalBars({ values }: SignalBarsProps) {
  return (
    <div className="flex h-28 items-end gap-2 rounded-[22px] border border-white/8 bg-black/24 p-4">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="flex-1 rounded-full bg-gradient-to-t from-emerald-500/30 to-emerald-300"
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  );
}
