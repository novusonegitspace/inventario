import Link from "next/link";

import type { Asset } from "@/src/features/assets/domain/asset";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

export function AssetList({
  assets,
  campaignId,
}: {
  assets: Asset[];
  campaignId: string;
}) {
  if (assets.length === 0) {
    return (
      <Panel className="space-y-4" glow padding="lg">
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Aún no hay activos registrados
        </h3>
        <p className="max-w-2xl text-sm leading-7 text-white/60">
          Comience agregando los activos principales de esta campaña para
          ordenar el inventario, preparar la captura y asignar responsables.
        </p>
        <Button href={`#nuevo-activo`}>Agregar primer activo</Button>
      </Panel>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {assets.map((asset) => (
        <Link key={asset.id} href={`/campaigns/${campaignId}/assets/${asset.id}`}>
          <Panel className="flex h-full flex-col gap-5 transition duration-200 hover:border-emerald-300/24 hover:bg-slate-950/88">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Badge tone={asset.isActive ? "emerald" : "outline"}>
                  {asset.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-white/56">
                    Barcode: {asset.barcode || "Sin barcode"} · Tag: {asset.assetTag}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                  Ubicación
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {asset.location || "Por definir"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Responsable
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {asset.responsible || "Pendiente"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Capturas
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {asset.captureCount}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Evidencias
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {asset.evidenceCount}
                </p>
              </div>
            </div>
          </Panel>
        </Link>
      ))}
    </div>
  );
}
