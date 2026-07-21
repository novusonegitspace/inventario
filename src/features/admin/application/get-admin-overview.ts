import "server-only";

import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { prisma } from "@/src/lib/db/prisma";

export type AdminRoleItem = {
  role: string;
  label: string;
  count: number;
};

export type AdminMemberItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastSeenAt: Date | null;
};

export type AdminClientItem = {
  id: string;
  name: string;
  code: string;
  campaignCount: number;
};

export type AdminOverview = {
  tenantName: string;
  activeUsers: number;
  activeClients: number;
  totalCampaigns: number;
  activeRoles: number;
  roleDistribution: AdminRoleItem[];
  members: AdminMemberItem[];
  clients: AdminClientItem[];
};

const roleLabels: Record<string, string> = {
  TENANT_ADMIN: "Administrador tenant",
  PROJECT_LEAD: "Líder de proyecto",
  SUPERVISOR: "Supervisor",
  FIELD_AUDITOR: "Auditor de terreno",
  CLIENT: "Cliente",
};

export async function getAdminOverview(): Promise<AdminOverview> {
  const context = await getRequiredAuthContext();

  const [memberships, clients, totalCampaigns] = await Promise.all([
    prisma.tenantUser.findMany({
      where: {
        tenantId: context.tenantId,
        isActive: true,
      },
      orderBy: [{ lastSeenAt: "desc" }, { joinedAt: "desc" }],
      select: {
        id: true,
        role: true,
        lastSeenAt: true,
        user: {
          select: {
            displayName: true,
            email: true,
          },
        },
      },
    }),
    prisma.client.findMany({
      where: {
        tenantId: context.tenantId,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        code: true,
        _count: {
          select: {
            campaigns: true,
          },
        },
      },
    }),
    prisma.campaign.count({
      where: {
        tenantId: context.tenantId,
      },
    }),
  ]);

  const roleCounters = Object.fromEntries(
    Object.keys(roleLabels).map((role) => [role, 0]),
  ) as Record<string, number>;

  for (const membership of memberships) {
    roleCounters[membership.role] = (roleCounters[membership.role] ?? 0) + 1;
  }

  const roleDistribution = Object.entries(roleLabels).map(([role, label]) => ({
    role,
    label,
    count: roleCounters[role] ?? 0,
  }));

  return {
    tenantName: context.tenantName,
    activeUsers: memberships.length,
    activeClients: clients.length,
    totalCampaigns,
    activeRoles: roleDistribution.filter((item) => item.count > 0).length,
    roleDistribution,
    members: memberships.slice(0, 10).map((membership) => ({
      id: membership.id,
      name: membership.user.displayName ?? membership.user.email,
      email: membership.user.email,
      role: roleLabels[membership.role] ?? membership.role,
      lastSeenAt: membership.lastSeenAt,
    })),
    clients: clients.slice(0, 8).map((client) => ({
      id: client.id,
      name: client.name,
      code: client.code,
      campaignCount: client._count.campaigns,
    })),
  };
}
