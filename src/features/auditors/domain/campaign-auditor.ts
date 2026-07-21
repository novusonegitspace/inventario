export type CampaignAuditorItem = {
  id: string;
  campaignId: string;
  userId: string;
  name: string;
  email: string;
  role: "tenant_admin" | "project_lead" | "supervisor" | "field_auditor" | "client";
  assignedAt: Date;
  removedAt: Date | null;
};

export function getCampaignAuditorRoleLabel(role: CampaignAuditorItem["role"]) {
  const labels: Record<CampaignAuditorItem["role"], string> = {
    tenant_admin: "Administrador tenant",
    project_lead: "Jefe de proyecto",
    supervisor: "Supervisor",
    field_auditor: "Auditor de terreno",
    client: "Cliente",
  };

  return labels[role];
}
