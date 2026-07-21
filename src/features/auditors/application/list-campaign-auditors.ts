import { auditorRepository } from "@/src/features/auditors/infrastructure/auditor-repository";

export async function listCampaignAuditors(campaignId: string) {
  return auditorRepository.listByCampaign(campaignId);
}
