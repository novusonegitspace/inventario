import type { Campaign } from "@/src/features/campaigns/domain/campaign";
import { CampaignCard } from "@/src/features/campaigns/ui/campaign-card";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

export function CampaignList({
  campaigns,
  emptyHref = "/campaigns/new",
}: {
  campaigns: Campaign[];
  emptyHref?: string;
}) {
  if (campaigns.length === 0) {
    return (
      <Panel className="space-y-4" glow padding="lg">
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Todavía no hay campañas creadas
        </h3>
        <p className="max-w-2xl text-sm leading-7 text-white/60">
          Cree una campaña para organizar el inventario por sede, asignar
          responsables, registrar capturas desde el celular y revisar
          diferencias antes del cierre.
        </p>
        <Button href={emptyHref}>Crear primera campaña</Button>
      </Panel>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
