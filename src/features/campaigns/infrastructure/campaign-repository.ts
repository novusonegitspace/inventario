import "server-only";

import type { Prisma } from "@prisma/client";

import type {
  Campaign,
  CreateCampaignDraft,
  InventoryMode,
} from "@/src/features/campaigns/domain/campaign";
import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { prisma } from "@/src/lib/db/prisma";

export type CampaignRepository = {
  list(): Promise<Campaign[]>;
  getById(id: string): Promise<Campaign | null>;
  create(input: CreateCampaignDraft): Promise<Campaign>;
};

function mapCampaignStatus(status: string) {
  if (status === "ACTIVE") {
    return "active";
  }

  if (status === "CLOSED") {
    return "closed";
  }

  return "draft";
}

function mapInventoryMode(mode: string): InventoryMode {
  if (mode === "SELECTIVE") {
    return "selective";
  }

  if (mode === "CYCLE_COUNT") {
    return "cycle_count";
  }

  return "full_count";
}

function mapInventoryModeForDb(mode: InventoryMode) {
  if (mode === "selective") {
    return "SELECTIVE";
  }

  if (mode === "cycle_count") {
    return "CYCLE_COUNT";
  }

  return "FULL_COUNT";
}

function normalizeClientCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

type CampaignRecord = Prisma.CampaignGetPayload<{
  include: {
    client: true;
    _count: {
      select: {
        auditors: true;
        assets: true;
        captures: true;
        evidenceFiles: true;
        findings: true;
      };
    };
  };
}>;

function mapCampaignRecord(campaign: CampaignRecord): Campaign {
  return {
    id: campaign.id,
    tenantId: campaign.tenantId,
    name: campaign.name,
    code: campaign.code,
    status: mapCampaignStatus(campaign.status),
    clientName: campaign.client?.name ?? "Sin cliente",
    siteName: campaign.siteName ?? "Sitio por definir",
    inventoryMode: mapInventoryMode(campaign.inventoryMode),
    auditorCount: campaign._count.auditors,
    assetCount: campaign._count.assets,
    captureCount: campaign._count.captures,
    evidenceCount: campaign._count.evidenceFiles,
    differenceCount: campaign._count.findings,
    progressPercentage: campaign.progressPercentage,
    scheduledStartAt: campaign.scheduledStartAt,
    scheduledEndAt: campaign.scheduledEndAt,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  };
}

export const campaignRepository: CampaignRepository = {
  async list() {
    const context = await getRequiredAuthContext();
    const campaigns = await prisma.campaign.findMany({
      where: {
        tenantId: context.tenantId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        client: true,
        _count: {
          select: {
            auditors: true,
            assets: true,
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    return campaigns.map(mapCampaignRecord);
  },

  async getById(id) {
    const context = await getRequiredAuthContext();
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        tenantId: context.tenantId,
      },
      include: {
        client: true,
        _count: {
          select: {
            auditors: true,
            assets: true,
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    if (!campaign) {
      return null;
    }

    return mapCampaignRecord(campaign);
  },

  async create(input) {
    const context = await getRequiredAuthContext();
    const clientCode = normalizeClientCode(input.clientName);

    const client = await prisma.client.upsert({
      where: {
        tenantId_code: {
          tenantId: context.tenantId,
          code: clientCode,
        },
      },
      update: {
        name: input.clientName,
        isActive: true,
      },
      create: {
        tenantId: context.tenantId,
        code: clientCode,
        name: input.clientName,
      },
    });

    const campaign = await prisma.campaign.create({
      data: {
        tenantId: context.tenantId,
        clientId: client.id,
        createdById: context.userId,
        code: input.code,
        name: input.name,
        siteName: input.siteName,
        status: "DRAFT",
        inventoryMode: mapInventoryModeForDb(input.inventoryMode),
        scheduledStartAt: input.scheduledStartAt
          ? new Date(`${input.scheduledStartAt}T09:00:00.000Z`)
          : null,
        scheduledEndAt: input.scheduledEndAt
          ? new Date(`${input.scheduledEndAt}T18:00:00.000Z`)
          : null,
        settings: {
          create: {
            tenantId: context.tenantId,
          },
        },
      },
      include: {
        client: true,
        _count: {
          select: {
            auditors: true,
            assets: true,
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    return mapCampaignRecord(campaign);
  },
};
