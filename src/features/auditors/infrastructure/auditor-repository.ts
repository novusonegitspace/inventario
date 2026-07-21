import "server-only";

import { prisma } from "@/src/lib/db/prisma";
import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import type { CampaignAuditorItem } from "@/src/features/auditors/domain/campaign-auditor";

function mapRole(role: string): CampaignAuditorItem["role"] {
  if (role === "TENANT_ADMIN") return "tenant_admin";
  if (role === "PROJECT_LEAD") return "project_lead";
  if (role === "SUPERVISOR") return "supervisor";
  if (role === "CLIENT") return "client";
  return "field_auditor";
}

export const auditorRepository = {
  async listByCampaign(campaignId: string): Promise<CampaignAuditorItem[]> {
    const context = await getRequiredAuthContext();

    const auditors = await prisma.campaignAuditor.findMany({
      where: {
        tenantId: context.tenantId,
        campaignId,
        removedAt: null,
      },
      include: {
        user: true,
      },
      orderBy: {
        assignedAt: "asc",
      },
    });

    return auditors.map((auditor) => ({
      id: auditor.id,
      campaignId: auditor.campaignId,
      userId: auditor.userId,
      name: auditor.user.displayName ?? auditor.user.email,
      email: auditor.user.email,
      role: mapRole(auditor.role),
      assignedAt: auditor.assignedAt,
      removedAt: auditor.removedAt,
    }));
  },
};
