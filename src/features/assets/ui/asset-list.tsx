import Link from "next/link";

import type { Asset } from "@/src/features/assets/domain/asset";
import { Badge } from "@/src/shared/ui/badge";
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
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
          Aún no hay activos registrados
        </h3>
        <p className="max-w-2xl text-sm leading-7 text-[#667085]">
          Use el formulario inferior para registrar el primer activo manual o
          cargue un maestro desde configuración si la campaña lo requiere.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {assets.map((asset) => (
        <Link key={asset.id} href={`/campaigns/${campaignId}/assets/${asset.id}`}>
          <Panel className="flex h-full flex-col gap-5 transition duration-200 hover:border-[#16b8ac] hover:shadow-[0_20px_54px_rgba(20,55,90,0.12)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Badge tone={asset.isActive ? "emerald" : "outline"}>
                  {asset.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#14375a]">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-[#667085]">
                    Barcode: {asset.barcode || "Sin barcode"} · Tag: {asset.assetTag}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-3 py-2 text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                  Ubicación
                </p>
                <p className="mt-1 text-sm font-semibold text-[#14375a]">
                  {asset.location || "Por definir"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                  Responsable
                </p>
                <p className="mt-2 text-sm font-semibold text-[#14375a]">
                  {asset.responsible || "Pendiente"}
                </p>
              </div>
              <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                  Capturas
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#14375a]">
                  {asset.captureCount}
                </p>
              </div>
              <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                  Evidencias
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#14375a]">
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
