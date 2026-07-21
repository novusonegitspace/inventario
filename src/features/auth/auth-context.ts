import "server-only";

import { prisma } from "@/src/lib/db/prisma";
import { getAuthSession } from "@/src/features/auth/session";

export type AuthContext = {
  sessionEmail: string;
  sessionName: string;
  tenantId: string;
  tenantName: string;
  userId: string;
};

function slugifyTenantName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapSessionRoleToMembershipRole(role: string) {
  if (role === "tenant_admin") {
    return "TENANT_ADMIN";
  }

  if (role === "project_lead") {
    return "PROJECT_LEAD";
  }

  if (role === "supervisor") {
    return "SUPERVISOR";
  }

  if (role === "client") {
    return "CLIENT";
  }

  return "FIELD_AUDITOR";
}

function mapAuthInfrastructureError(error: unknown) {
  if (!(error instanceof Error)) {
    return new Error("No se pudo resolver el contexto de autenticación.");
  }

  if (
    error.message.includes("Can't reach database server") ||
    error.message.includes("Missing DATABASE_URL")
  ) {
    return new Error(
      "No se pudo conectar con la base de datos. Inicie SQL Server local con `npm run db:up` o configure DATABASE_URL al servidor correcto.",
    );
  }

  return error;
}

export async function getRequiredAuthContext(): Promise<AuthContext> {
  const session = await getAuthSession();

  if (!session) {
    throw new Error("Missing auth session.");
  }

  const tenantSlug = slugifyTenantName(session.tenantName);

  try {
    const [tenant, user] = await Promise.all([
      prisma.tenant.upsert({
        where: { slug: tenantSlug },
        update: {
          name: session.tenantName,
        },
        create: {
          slug: tenantSlug,
          name: session.tenantName,
        },
      }),
      prisma.user.upsert({
        where: { email: session.email },
        update: {
          displayName: session.name,
        },
        create: {
          email: session.email,
          displayName: session.name,
        },
      }),
    ]);

    await prisma.tenantUser.upsert({
      where: {
        tenantId_userId: {
          tenantId: tenant.id,
          userId: user.id,
        },
      },
      update: {
        isActive: true,
        role: mapSessionRoleToMembershipRole(session.role),
        lastSeenAt: new Date(),
      },
      create: {
        tenantId: tenant.id,
        userId: user.id,
        role: mapSessionRoleToMembershipRole(session.role),
        lastSeenAt: new Date(),
      },
    });

    return {
      sessionEmail: session.email,
      sessionName: session.name,
      tenantId: tenant.id,
      tenantName: tenant.name,
      userId: user.id,
    };
  } catch (error) {
    throw mapAuthInfrastructureError(error);
  }
}
