import "server-only";

import type {
  CampaignSettings,
  CampaignSettingsInput,
} from "@/src/features/campaigns/domain/campaign-settings";
import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { prisma } from "@/src/lib/db/prisma";

function mapCampaignSettingsRecord(
  settings: Awaited<ReturnType<typeof prisma.campaignSettings.upsert>>,
): CampaignSettings {
  return {
    campaignId: settings.campaignId,
    captureRequiresPhoto: settings.captureRequiresPhoto,
    captureRequiresGeo: settings.captureRequiresGeo,
    allowManualAssets: settings.allowManualAssets,
    closeBlocksCaptures: settings.closeBlocksCaptures,
    notes: settings.notes ?? "",
    updatedAt: settings.updatedAt,
  };
}

export const campaignSettingsRepository = {
  async getByCampaignId(campaignId: string): Promise<CampaignSettings | null> {
    const context = await getRequiredAuthContext();
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        tenantId: context.tenantId,
      },
      select: {
        id: true,
      },
    });

    if (!campaign) {
      return null;
    }

    const settings = await prisma.campaignSettings.upsert({
      where: {
        campaignId,
      },
      update: {},
      create: {
        tenantId: context.tenantId,
        campaignId,
      },
    });

    return mapCampaignSettingsRecord(settings);
  },

  async updateByCampaignId(
    campaignId: string,
    input: CampaignSettingsInput,
  ): Promise<CampaignSettings | null> {
    const context = await getRequiredAuthContext();
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        tenantId: context.tenantId,
      },
      select: {
        id: true,
      },
    });

    if (!campaign) {
      return null;
    }

    const settings = await prisma.campaignSettings.upsert({
      where: {
        campaignId,
      },
      update: {
        captureRequiresPhoto: input.captureRequiresPhoto,
        captureRequiresGeo: input.captureRequiresGeo,
        allowManualAssets: input.allowManualAssets,
        closeBlocksCaptures: input.closeBlocksCaptures,
        notes: input.notes || null,
      },
      create: {
        tenantId: context.tenantId,
        campaignId,
        captureRequiresPhoto: input.captureRequiresPhoto,
        captureRequiresGeo: input.captureRequiresGeo,
        allowManualAssets: input.allowManualAssets,
        closeBlocksCaptures: input.closeBlocksCaptures,
        notes: input.notes || null,
      },
    });

    return mapCampaignSettingsRecord(settings);
  },
};
