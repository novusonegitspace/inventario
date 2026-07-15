import { getAssetDetail } from "@/src/features/assets/application/get-asset-detail";
import { AssetDetailHeader } from "@/src/features/assets/ui/asset-detail-header";
import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { listAssetCaptures } from "@/src/features/captures/application/list-asset-captures";
import { CaptureList } from "@/src/features/captures/ui/capture-list";
import { Panel } from "@/src/shared/ui/panel";
import { SectionHeading } from "@/src/shared/ui/section-heading";
import { StatCard } from "@/src/shared/ui/stat-card";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string; assetId: string }>;
}) {
  const { campaignId, assetId } = await params;
  const [campaign, asset, captures] = await Promise.all([
    getCampaignDetail(campaignId),
    getAssetDetail(campaignId, assetId),
    listAssetCaptures(campaignId, assetId),
  ]);

  if (!campaign || !asset) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Panel className="space-y-5" glow padding="lg">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white">
            No encontramos este activo
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/60">
            Revise el listado de activos de la campaña y vuelva a seleccionar el
            registro que desea consultar.
          </p>
        </Panel>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <AssetDetailHeader asset={asset} campaignId={campaign.id} />

      <section className="grid gap-6 lg:grid-cols-4">
        <StatCard
          summary="Capturas registradas sobre este activo."
          title="Capturas"
          trend="Terreno"
          value={String(asset.captureCount)}
        />
        <StatCard
          summary="Evidencias vinculadas al activo."
          title="Evidencias"
          trend="Respaldo"
          value={String(asset.evidenceCount)}
        />
        <StatCard
          summary="Hallazgos o diferencias abiertas para revisión."
          title="Hallazgos"
          trend="Revisión"
          value={String(asset.findingCount)}
        />
        <StatCard
          summary="Último momento en que el activo fue capturado."
          title="Última captura"
          trend="Seguimiento"
          value={
            asset.latestCaptureAt
              ? new Intl.DateTimeFormat("es-CL", {
                  day: "2-digit",
                  month: "short",
                }).format(asset.latestCaptureAt)
              : "Pendiente"
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="space-y-6" padding="lg">
          <SectionHeading
            eyebrow="Ficha del activo"
            title="Información principal para identificar y ubicar el activo"
            description="Mantenga estos datos actualizados para que la captura y la conciliación se apoyen en una referencia confiable."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
              <p className="text-sm text-white/50">Código de barras</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {asset.barcode || "Sin barcode registrado"}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
              <p className="text-sm text-white/50">Etiqueta</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {asset.assetTag}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
              <p className="text-sm text-white/50">Serie</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {asset.serialNumber || "Sin serie registrada"}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
              <p className="text-sm text-white/50">Ubicación</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {asset.location || "Sin ubicación registrada"}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
              <p className="text-sm text-white/50">Centro de costo</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {asset.costCenter || "Sin centro de costo"}
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="space-y-6" padding="lg">
          <SectionHeading
            eyebrow="Responsabilidad"
            title="A quién pertenece o quién responde por este activo"
            description="Esta referencia ayuda a ordenar validaciones, auditorías y revisiones de diferencias."
          />
          <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
            <p className="text-sm text-white/50">Responsable</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {asset.responsible || "Sin responsable registrado"}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
            <p className="text-sm text-white/50">Estado</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {asset.isActive ? "Activo en operación" : "Fuera de operación"}
            </p>
          </div>
        </Panel>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Capturas registradas"
          title="Historial de lectura y observaciones de este activo"
          description="Consulte el detalle de las visitas realizadas en terreno y use la captura móvil para actualizar la información cuando sea necesario."
        />
        <CaptureList captures={captures} />
      </section>
    </main>
  );
}
