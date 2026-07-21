const labels: Record<string, string> = {
  draft: "Borrador",
  active: "Activa",
  in_review: "En revisión",
  completed: "Completada",
  closed: "Cerrada",
  conciliado: "Conciliado",
  conciliado_con_diferencias: "Con diferencias",
  no_encontrado: "No encontrado",
  sobrante: "Sobrante",
  pendiente: "Pendiente",
};

const toneClasses: Record<string, string> = {
  active: "bg-[#e8f7f2] text-[#027a48]",
  in_review: "bg-[#eef5fb] text-[#14375a]",
  completed: "bg-[#eef5fb] text-[#14375a]",
  conciliado: "bg-[#e8f7f2] text-[#027a48]",
  closed: "bg-[#fff4e5] text-[#b54708]",
  sobrante: "bg-[#fff4e5] text-[#b54708]",
  conciliado_con_diferencias: "bg-[#fff4e5] text-[#b54708]",
  draft: "bg-[#eef5fb] text-[#14375a]",
  pendiente: "bg-[#eef5fb] text-[#14375a]",
};

export function MvpStatusPill({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex min-h-[26px] items-center rounded-full px-3 text-xs font-bold ${
        toneClasses[value] ?? "bg-[#eef5fb] text-[#14375a]"
      }`}
    >
      {labels[value] ?? value}
    </span>
  );
}
