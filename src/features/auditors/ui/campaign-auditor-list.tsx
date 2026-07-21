import {
  getCampaignAuditorRoleLabel,
  type CampaignAuditorItem,
} from "@/src/features/auditors/domain/campaign-auditor";

export function CampaignAuditorList({
  auditors,
}: {
  auditors: CampaignAuditorItem[];
}) {
  if (auditors.length === 0) {
    return (
      <div className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
          Todavía no hay auditores asignados
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667085]">
          El siguiente slice debe permitir asignar auditores, supervisores y
          responsables de campaña con control por tenant y por rol.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {auditors.map((auditor) => (
        <div
          key={auditor.id}
          className="flex items-center justify-between gap-4 rounded-lg border border-[#e4e7eb] bg-white p-4 shadow-[0_18px_48px_rgba(20,55,90,0.05)]"
        >
          <div className="grid gap-1">
            <strong className="text-base font-semibold text-[#2d2d2d]">
              {auditor.name}
            </strong>
            <span className="text-sm text-[#667085]">{auditor.email}</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-[#14375a]">
              {getCampaignAuditorRoleLabel(auditor.role)}
            </p>
            <p className="mt-1 text-xs text-[#667085]">
              Asignado el{" "}
              {new Intl.DateTimeFormat("es-CL", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(auditor.assignedAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
