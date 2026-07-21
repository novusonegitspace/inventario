import { campaignRepository } from "@/src/features/campaigns/infrastructure/campaign-repository";

type ActivateCampaignResult =
  | { ok: true; campaignId: string }
  | { ok: false; message: string };

export async function activateCampaign(
  campaignId: string,
): Promise<ActivateCampaignResult> {
  const campaign = await campaignRepository.getById(campaignId);

  if (!campaign) {
    return {
      ok: false,
      message: "No pudimos encontrar la campaña para activarla.",
    };
  }

  if (campaign.status === "closed") {
    return {
      ok: false,
      message: "La campaña ya está cerrada y no puede volver a captura.",
    };
  }

  if (campaign.status === "in_review" || campaign.status === "completed") {
    return {
      ok: false,
      message:
        "La campaña ya salió de ejecución. Requiere una reapertura explícita para volver a captura.",
    };
  }

  const updatedCampaign = await campaignRepository.activate(campaignId);

  if (!updatedCampaign) {
    return {
      ok: false,
      message: "No pudimos activar la campaña.",
    };
  }

  return {
    ok: true,
    campaignId: updatedCampaign.id,
  };
}
