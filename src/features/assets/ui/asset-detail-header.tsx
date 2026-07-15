import type { Asset } from "@/src/features/assets/domain/asset";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

export function AssetDetailHeader({
  asset,
  campaignId,
}: {
  asset: Asset;
  campaignId: string;
}) {
  return (
    <Panel className="space-y-6" glow padding="lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={asset.isActive ? "emerald" : "outline"}>
              {asset.isActive ? "Activo" : "Inactivo"}
            </Badge>
            {asset.barcode ? <Badge tone="slate">{asset.barcode}</Badge> : null}
            <Badge tone="slate">{asset.assetTag}</Badge>
            {asset.serialNumber ? <Badge tone="slate">{asset.serialNumber}</Badge> : null}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
              {asset.name}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-white/62">
              Consulte la ubicación, el responsable y el estado de captura de
              este activo dentro de la campaña actual.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={`/campaigns/${campaignId}/assets/${asset.id}/capture`} size="sm">
            Registrar captura
          </Button>
          <Button
            href={`/campaigns/${campaignId}/assets/${asset.id}/evidence`}
            size="sm"
            variant="secondary"
          >
            Ver evidencia
          </Button>
          <Button href={`/campaigns/${campaignId}/assets`} size="sm" variant="secondary">
            Volver a activos
          </Button>
          <Button href={`/campaigns/${campaignId}`} size="sm" variant="secondary">
            Volver a campaña
          </Button>
        </div>
      </div>
    </Panel>
  );
}
